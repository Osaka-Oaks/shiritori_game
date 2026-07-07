# Terraform/OpenTofu Variables
# Define all input variables for the infrastructure

variable "project_id" {
  description = "Google Cloud Project ID for Firebase"
  type        = string
  default     = "shiritori-game-ccaae"

  validation {
    condition     = can(regex("^[a-z][a-z0-9-]{4,28}[a-z0-9]$", var.project_id))
    error_message = "Project ID must be a valid GCP project identifier."
  }
}

variable "region" {
  description = "Primary GCP region for resources"
  type        = string
  default     = "us-central1"

  validation {
    condition     = can(regex("^[a-z]+-[a-z]+[0-9]$", var.region))
    error_message = "Region must be a valid GCP region (e.g., us-central1)."
  }
}

variable "environment" {
  description = "Environment name (dev, staging, production)"
  type        = string
  default     = "production"

  validation {
    condition     = contains(["dev", "staging", "production"], var.environment)
    error_message = "Environment must be one of: dev, staging, production."
  }
}

variable "enable_apis" {
  description = "Map of GCP APIs to enable"
  type        = map(bool)
  default = {
    firebase           = true
    firestore          = true
    firebase_database  = true
    firebase_hosting   = true
    cloud_functions    = true
    cloud_run          = true
    compute            = true
    storage            = true
    cloud_scheduler    = true
    monitoring         = true
    logging            = true
  }
}

variable "cloud_run_config" {
  description = "Configuration for Cloud Run services"
  type = object({
    cpu_limit       = string
    memory_limit    = string
    min_instances   = number
    max_instances   = number
    timeout_seconds = number
  })
  default = {
    cpu_limit       = "1000m"
    memory_limit    = "512Mi"
    min_instances   = 0
    max_instances   = 10
    timeout_seconds = 300
  }
}

variable "firestore_config" {
  description = "Firestore database configuration"
  type = object({
    location_id = string
    type        = string
  })
  default = {
    location_id = "us-central1"
    type        = "FIRESTORE_NATIVE"
  }
}

variable "storage_config" {
  description = "Cloud Storage bucket configuration"
  type = object({
    location      = string
    storage_class = string
    force_destroy = bool
  })
  default = {
    location      = "US"
    storage_class = "STANDARD"
    force_destroy = false
  }
}

variable "monitoring_config" {
  description = "Monitoring and alerting configuration"
  type = object({
    uptime_check_period  = string
    uptime_check_timeout = string
    alert_auto_close     = string
  })
  default = {
    uptime_check_period  = "60s"
    uptime_check_timeout = "10s"
    alert_auto_close     = "1800s"
  }
}

variable "scheduler_jobs" {
  description = "Configuration for Cloud Scheduler cron jobs"
  type = map(object({
    description = string
    schedule    = string
    time_zone   = string
    endpoint    = string
  }))
  default = {
    cleanup_games = {
      description = "Clean up old games (30+ days)"
      schedule    = "0 2 * * *"
      time_zone   = "America/New_York"
      endpoint    = "/api/cleanup"
    }
    update_leaderboard = {
      description = "Update leaderboard rankings"
      schedule    = "0 * * * *"
      time_zone   = "America/New_York"
      endpoint    = "/api/leaderboard/update"
    }
    analytics_report = {
      description = "Generate daily analytics report"
      schedule    = "0 0 * * *"
      time_zone   = "America/New_York"
      endpoint    = "/api/analytics/report"
    }
  }
}

variable "labels" {
  description = "Common labels to apply to all resources"
  type        = map(string)
  default = {
    project     = "shiritori-game"
    managed_by  = "terraform"
    repository  = "github"
  }
}

variable "notification_channels" {
  description = "List of notification channel IDs for alerts"
  type        = list(string)
  default     = []
}

variable "domain" {
  description = "Custom domain for the application (optional)"
  type        = string
  default     = ""
}

variable "enable_cdn" {
  description = "Enable Cloud CDN for hosting"
  type        = bool
  default     = true
}

variable "enable_ssl" {
  description = "Enable SSL/TLS for custom domain"
  type        = bool
  default     = true
}

variable "cors_origins" {
  description = "List of allowed CORS origins"
  type        = list(string)
  default     = ["*"]
}

variable "retention_days" {
  description = "Data retention period in days"
  type        = number
  default     = 90

  validation {
    condition     = var.retention_days >= 1 && var.retention_days <= 3650
    error_message = "Retention days must be between 1 and 3650."
  }
}

variable "enable_backups" {
  description = "Enable automated backups for Firestore"
  type        = bool
  default     = true
}

variable "backup_schedule" {
  description = "Cron schedule for Firestore backups"
  type        = string
  default     = "0 3 * * *" # Daily at 3 AM
}

variable "enable_monitoring" {
  description = "Enable monitoring and alerting"
  type        = bool
  default     = true
}

variable "enable_logging" {
  description = "Enable Cloud Logging"
  type        = bool
  default     = true
}

variable "log_retention_days" {
  description = "Log retention period in days"
  type        = number
  default     = 30
}

variable "budget_amount" {
  description = "Monthly budget amount in USD"
  type        = number
  default     = 50
}

variable "budget_alert_thresholds" {
  description = "Budget alert threshold percentages"
  type        = list(number)
  default     = [50, 75, 90, 100]
}

# Feature Flags
variable "features" {
  description = "Feature flags for infrastructure components"
  type = object({
    cloud_run         = bool
    cloud_functions   = bool
    cloud_scheduler   = bool
    monitoring        = bool
    custom_domain     = bool
    cdn               = bool
  })
  default = {
    cloud_run       = true
    cloud_functions = false
    cloud_scheduler = true
    monitoring      = true
    custom_domain   = false
    cdn             = true
  }
}

# Tags
variable "tags" {
  description = "Additional tags for resources"
  type        = map(string)
  default     = {}
}
