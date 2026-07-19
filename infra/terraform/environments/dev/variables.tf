variable "project_id" {
  type        = string
  description = "Firebase / GCP project ID"
  default     = "shiritori-game-ccaae"
}

variable "region" {
  type        = string
  description = "Default region"
  default     = "us-central1"
}

variable "environment" {
  type        = string
  description = "Environment name"
  default     = "dev"
}
