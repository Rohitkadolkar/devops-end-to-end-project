##  Setup Instructions

### 1. Clone the repository
```
git clone https://github.com/Rohitkadolkar/devops-end-to-end-project.git
```
### Provision Infra using Terraform

aws configure with aws cli
cd terraform-infra
Change Account details in variables
terraform init
terraform apply

### Configure access to EKS

Use IAM with EKS access 
aws eks update-kubeconfig --region ap-south-1 --name devops-eks

### Install Prometheus & Grafana

helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm install prom prometheus-community/kube-prometheus-stack -n monitoring --create-namespace

### CI/CD Setup

• Create EC2 in public subnet for Jenkins and install Java, Docker and Jenkins
• You can follow this documentation - https://www.jenkins.io/doc/book/installing/linux/
• Assign IAM role to Jenkins for accessing EKS 
• Login to Jenkins
• Create Jenkins job
• Add Jenkinsfile from repo
• Add GitHub Webhook
• Add AWS credentials + install Docker + Node + npm on Jenkins server


