# Module template — copy to modules/<name> and uncomment resources as needed.
#
# Example: GCS bucket for Flutter web artifacts
#
# resource "google_storage_bucket" "web_artifacts" {
#   name     = "${var.project_id}-${var.environment}-flutter-web"
#   location = "US"
#   labels   = var.labels
# }

# Pass-through for wiring tests until real resources are added.
locals {
  module_name = "template"
}
