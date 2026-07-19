# OpenTofu module template — mirror of infra/terraform/modules/_template
#
# resource "google_storage_bucket" "web_artifacts" {
#   name     = "${var.project_id}-${var.environment}-flutter-web"
#   location = "US"
#   labels   = var.labels
# }

locals {
  module_name = "template"
}
