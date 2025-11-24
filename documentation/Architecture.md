## Architecture Diagram

This project follows a modern production-grade DevOps architecture:

- A VPC with public and private subnets
- EKS cluster deployed in private subnets
- Node groups running in private subnets
- Application exposed using an AWS Load Balancer (public)
- Prometheus & Grafana installed inside the cluster using Helm
- Prometheus scrapes application /metrics endpoint
- Terraform manages entire infra + backend state (S3 + DynamoDB)
- Jenkins handles CI/CD and automatically deploys updates to EKS

![Devops-end-to-end](https://github.com/user-attachments/assets/a8ea360a-58d8-483d-902b-940e37ebf1ce)

