# Shiritori Game Infrastructure
# Terraform/OpenTofu Configuration
# Compatible with both Terraform and OpenTofu

terraform {
  required_version = ">= 1.0"
  
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
    google-beta = {
      source  = "hashicorp/google-beta"
      version = "~> 5.0"
    }
  }

  # Backend configuration for state management
  backend "gcs" {
    bucket = "shiritori-game-terraform-state"
    prefix = "terraform/state"
  }
}

# Variables
variable "project_id" {
  description = "GCP Project ID"
  type        = string
  default     = "shiritori-game-ccaae"
}

variable "region" {
  description = "GCP Region"
  type        = string
  default     = "us-central1"
}

variable "environment" {
  description = "Environment (dev, staging, production)"
  type        = string
  default     = "production"
}

# Locals
locals {
  app_name = "shiritori-game"
  labels = {
    app         = "shiritori"
    environment = var.environment
    managed_by  = "terraform"
  }
}

# Provider Configuration
provider "google" {
  project = var.project_id
  region  = var.region
}

provider "google-beta" {
  project = var.project_id
  region  = var.region
}

# Google Cloud Project
data "google_project" "project" {
  project_id = var.project_id
}

# Enable Required APIs
resource "google_project_service" "services" {
  for_each = toset([
    "firebase.googleapis.com",
    "firestore.googleapis.com",
    "firebasedatabase.googleapis.com",
    "firebasehosting.googleapis.com",
    "cloudfunctions.googleapis.com",
    "run.googleapis.com",
    "compute.googleapis.com",
    "storage-api.googleapis.com",
    "cloudscheduler.googleapis.com",
    "monitoring.googleapis.com",
    "logging.googleapis.com",
  ])

  project = var.project_id
  service = each.value

  disable_on_destroy = false
}

# Firebase Project
resource "google_firebase_project" "default" {
  provider = google-beta
  project  = var.project_id

  depends_on = [
    google_project_service.services
  ]
}

# Firestore Database
resource "google_firestore_database" "database" {
  project     = var.project_id
  name        = "(default)"
  location_id = var.region
  type        = "FIRESTORE_NATIVE"

  depends_on = [
    google_firebase_project.default
  ]
}

# Cloud Storage Bucket for Hosting
resource "google_storage_bucket" "hosting" {
  name          = "${var.project_id}-hosting"
  location      = var.region
  force_destroy = false

  uniform_bucket_level_access = true

  website {
    main_page_suffix = "index.html"
    not_found_page   = "index.html"
  }

  cors {
    origin          = ["*"]
    method          = ["GET", "HEAD"]
    response_header = ["*"]
    max_age_seconds = 3600
  }

  labels = local.labels
}

# Cloud Storage Bucket for Firebase Storage
resource "google_storage_bucket" "firebase_storage" {
  name          = "${var.project_id}.appspot.com"
  location      = var.region
  force_destroy = false

  uniform_bucket_level_access = true

  cors {
    origin          = ["*"]
    method          = ["GET", "HEAD", "PUT", "POST", "DELETE"]
    response_header = ["*"]
    max_age_seconds = 3600
  }

  labels = local.labels
}

# Cloud Storage Bucket for Terraform State
resource "google_storage_bucket" "terraform_state" {
  name          = "shiritori-game-terraform-state"
  location      = var.region
  force_destroy = false

  uniform_bucket_level_access = true
  
  versioning {
    enabled = true
  }

  lifecycle_rule {
    condition {
      num_newer_versions = 5
    }
    action {
      type = "Delete"
    }
  }

  labels = local.labels
}

# Cloud Run Service (Optional - for server-side rendering or API)
resource "google_cloud_run_service" "api" {
  name     = "${local.app_name}-api"
  location = var.region

  template {
    spec {
      containers {
        image = "gcr.io/${var.project_id}/shiritori-api:latest"
        
        ports {
          container_port = 8080
        }

        env {
          name  = "FIREBASE_PROJECT_ID"
          value = var.project_id
        }

        env {
          name  = "ENVIRONMENT"
          value = var.environment
        }

        resources {
          limits = {
            cpu    = "1000m"
            memory = "512Mi"
          }
        }
      }
    }

    metadata {
      annotations = {
        "autoscaling.knative.dev/minScale" = "0"
        "autoscaling.knative.dev/maxScale" = "10"
      }
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }

  lifecycle {
    ignore_changes = [
      template[0].spec[0].containers[0].image,
    ]
  }
}

# Cloud Run IAM - Allow unauthenticated access
resource "google_cloud_run_service_iam_member" "api_public" {
  service  = google_cloud_run_service.api.name
  location = google_cloud_run_service.api.location
  role     = "roles/run.invoker"
  member   = "allUsers"
}

# Cloud Scheduler for Cron Jobs
resource "google_cloud_scheduler_job" "cleanup_old_games" {
  name             = "cleanup-old-games"
  description      = "Clean up games older than 30 days"
  schedule         = "0 2 * * *" # Daily at 2 AM
  time_zone        = "America/New_York"
  attempt_deadline = "320s"

  http_target {
    http_method = "POST"
    uri         = "${google_cloud_run_service.api.status[0].url}/api/cleanup"
    
    oidc_token {
      service_account_email = google_service_account.scheduler.email
    }
  }

  depends_on = [
    google_project_service.services
  ]
}

# Service Account for Cloud Scheduler
resource "google_service_account" "scheduler" {
  account_id   = "scheduler-sa"
  display_name = "Cloud Scheduler Service Account"
  description  = "Service account for Cloud Scheduler jobs"
}

# IAM for Service Account
resource "google_project_iam_member" "scheduler_cloudrun" {
  project = var.project_id
  role    = "roles/run.invoker"
  member  = "serviceAccount:${google_service_account.scheduler.email}"
}

# Monitoring - Uptime Check
resource "google_monitoring_uptime_check_config" "web_app" {
  display_name = "${local.app_name}-uptime-check"
  timeout      = "10s"
  period       = "60s"

  http_check {
    path         = "/"
    port         = 443
    use_ssl      = true
    validate_ssl = true
  }

  monitored_resource {
    type = "uptime_url"
    labels = {
      project_id = var.project_id
      host       = "${var.project_id}.web.app"
    }
  }

  content_matchers {
    content = "Shiritori"
    matcher = "CONTAINS_STRING"
  }
}

# Monitoring - Alert Policy
resource "google_monitoring_alert_policy" "uptime_alert" {
  display_name = "${local.app_name}-uptime-alert"
  combiner     = "OR"
  
  conditions {
    display_name = "Uptime check failed"
    
    condition_threshold {
      filter          = "metric.type=\"monitoring.googleapis.com/uptime_check/check_passed\" AND resource.type=\"uptime_url\""
      duration        = "60s"
      comparison      = "COMPARISON_LT"
      threshold_value = 1
      
      aggregations {
        alignment_period   = "60s"
        per_series_aligner = "ALIGN_FRACTION_TRUE"
      }
    }
  }

  notification_channels = []

  alert_strategy {
    auto_close = "1800s"
  }
}

# Outputs
output "project_id" {
  description = "GCP Project ID"
  value       = var.project_id
}

output "region" {
  description = "GCP Region"
  value       = var.region
}

output "firebase_project_id" {
  description = "Firebase Project ID"
  value       = google_firebase_project.default.project
}

output "api_url" {
  description = "Cloud Run API URL"
  value       = google_cloud_run_service.api.status[0].url
}

output "hosting_bucket" {
  description = "Hosting bucket name"
  value       = google_storage_bucket.hosting.name
}

output "storage_bucket" {
  description = "Firebase storage bucket name"
  value       = google_storage_bucket.firebase_storage.name
}
