terraform {
  backend "s3" {
    bucket  = "terraform-test-mod"
    key     = "eks/terraform.tfstate"
    region  = "ap-south-1"
    encrypt = true
  }
}
