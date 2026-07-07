variable "project_id" {
  type        = string
  description = "GCP / Firebase project ID"
}

variable "environment" {
  type        = string
  description = "Environment name (dev, staging, production)"
  default     = "dev"
}

variable "labels" {
  type        = map(string)
  description = "Resource labels"
  default     = {}
}
