##  Terraform Structure Explanation

### Files & Purpose
```
| File | Purpose |
|------|---------|
| vpc.tf | Creates VPC, subnets, NAT, routing |
| eks.tf | Creates EKS cluster + node groups |
| eks-access.tf | Grants IAM user admin access to EKS |
| providers.tf | AWS & Kubernetes provider configurations |
| backend.tf | Remote backend using S3 + DynamoDB table |
| variables.tf | All input variables |
| terraform.tfvars | Values for variables |
| s3-dynamodb.tf | Creates DynamoDB table for TF locking |
| outputs.tf | Outputs cluster name, VPC, nodes |
| versions.tf | Provider version pins |
| module.eks/ | Contains the full EKS module |
```
### Backend (State Management)
```
- *S3 bucket* → stores the Terraform state file  
- *DynamoDB table* → ensures only 1 Terraform apply runs at a time  
- Prevents corruption or parallel updates
```
