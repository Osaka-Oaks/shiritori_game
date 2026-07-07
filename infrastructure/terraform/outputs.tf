# Terraform/OpenTofu Outputs
# Export important resource information

# Project Information
output "project_id" {
  description = "Google Cloud Project ID"
  value       = var.project_id
}

output "project_number" {
  description = "Google Cloud Project Number"
  value       = data.google_project.project.number
}

output "region" {
  description = "Primary GCP region"
  value       = var.region
}

output "environment" {
  description = "Environment name"
  value       = var.environment
}

# Firebase
output "firebase_project_id" {
  description = "Firebase Project ID"
  value       = google_firebase_project.default.project
}

output "firebase_web_url" {
  description = "Firebase Hosting URL"
  value       = "https://${var.project_id}.web.app"
}

output "firebase_storage_url" {
  description = "Firebase Storage URL"
  value       = "gs://${google_storage_bucket.firebase_storage.name}"
}

output "firebase_database_url" {
  description = "Firebase Realtime Database URL"
  value       = "https://${var.project_id}-default-rtdb.firebaseio.com"
}

# Firestore
output "firestore_database_name" {
  description = "Firestore database name"
  value       = google_firestore_database.database.name
}

output "firestore_location" {
  description = "Firestore database location"
  value       = google_firestore_database.database.location_id
}

# Cloud Storage
output "hosting_bucket_name" {
  description = "Hosting bucket name"
  value       = google_storage_bucket.hosting.name
}

output "hosting_bucket_url" {
  description = "Hosting bucket URL"
  value       = google_storage_bucket.hosting.url
}

output "storage_bucket_name" {
  description = "Firebase storage bucket name"
  value       = google_storage_bucket.firebase_storage.name
}

output "terraform_state_bucket" {
  description = "Terraform state bucket name"
  value       = google_storage_bucket.terraform_state.name
}

# Cloud Run
output "api_service_name" {
  description = "Cloud Run API service name"
  value       = google_cloud_run_service.api.name
}

output "api_url" {
  description = "Cloud Run API URL"
  value       = google_cloud_run_service.api.status[0].url
}

output "api_latest_revision" {
  description = "Cloud Run API latest revision"
  value       = google_cloud_run_service.api.status[0].latest_ready_revision_name
}

# Service Accounts
output "scheduler_service_account_email" {
  description = "Cloud Scheduler service account email"
  value       = google_service_account.scheduler.email
}

# Monitoring
output "uptime_check_id" {
  description = "Uptime check configuration ID"
  value       = google_monitoring_uptime_check_config.web_app.uptime_check_id
}

output "alert_policy_name" {
  description = "Alert policy name"
  value       = google_monitoring_alert_policy.uptime_alert.name
}

# URLs and Endpoints
output "urls" {
  description = "Important URLs for the application"
  value = {
    web_app           = "https://${var.project_id}.web.app"
    web_app_firebaseapp = "https://${var.project_id}.firebaseapp.com"
    api               = google_cloud_run_service.api.status[0].url
    console           = "https://console.firebase.google.com/project/${var.project_id}"
    firestore_console = "https://console.firebase.google.com/project/${var.project_id}/firestore"
    storage_console   = "https://console.firebase.google.com/project/${var.project_id}/storage"
    hosting_console   = "https://console.firebase.google.com/project/${var.project_id}/hosting"
  }
}

# Configuration Summary
output "configuration" {
  description = "Infrastructure configuration summary"
  value = {
    project_id  = var.project_id
    region      = var.region
    environment = var.environment
    features    = var.features
    monitoring_enabled = var.enable_monitoring
    backups_enabled    = var.enable_backups
  }
  sensitive = false
}

# Deployment Commands
output "deployment_commands" {
  description = "Useful deployment commands"
  value = {
    firebase_deploy   = "firebase deploy --only hosting --project ${var.project_id}"
    firestore_rules   = "firebase deploy --only firestore:rules --project ${var.project_id}"
    cloud_run_deploy  = "gcloud run deploy ${google_cloud_run_service.api.name} --region ${var.region} --project ${var.project_id}"
    view_logs         = "gcloud logging read --project ${var.project_id} --limit 50"
  }
}

# Resource IDs (for use in other configurations)
output "resource_ids" {
  description = "Resource IDs for reference"
  value = {
    project_id           = var.project_id
    project_number       = data.google_project.project.number
    firestore_database   = google_firestore_database.database.name
    hosting_bucket       = google_storage_bucket.hosting.name
    storage_bucket       = google_storage_bucket.firebase_storage.name
    api_service          = google_cloud_run_service.api.name
    scheduler_sa         = google_service_account.scheduler.email
  }
}

# Terraform State
output "terraform_state" {
  description = "Terraform state backend configuration"
  value = {
    backend = "gcs"
    bucket  = google_storage_bucket.terraform_state.name
    prefix  = "terraform/state"
  }
}
