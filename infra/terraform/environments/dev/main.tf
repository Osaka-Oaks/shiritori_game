terraform {
  required_version = ">= 1.6.0"

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

module "template" {
  source = "../../modules/_template"

  project_id  = var.project_id
  environment = var.environment
  labels = {
    app         = "shiritori"
    environment = var.environment
    managed_by  = "terraform"
  }
}
