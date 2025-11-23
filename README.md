# DevOps End-to-end Project

This project demonstrates a complete real-world DevOps pipeline including Docker,CI/CD, Kubernetes (EKS), Terraform infrastructure, monitoring, and automated deployments.

## Application & Monitoring URLs

### Application(Todo App)

URL: http://a558925b91fbe4472aca3d8b9544c9db-1811821463.ap-south-1.elb.amazonaws.com/

### Grafana Dashboard

URL: http://a4611bf18afe04bd3adc43ce3d87f92a-306919747.ap-south-1.elb.amazonaws.com/d/PTSqcpJWk/nodejs-application-dashboard?orgId=1&from=now-1h&to=now&timezone=browser&var-instance=$__all

## 📁 Project Structure
```
devops-end-to-end-project/
│
├── app/
│   ├── server.js
│   ├── package.json
│   ├── Dockerfile
│   ├── public/
│   └── test/
│
├── Jenkinsfile                    # CI/CD Pipeline
│
├── todo-app/                      # Helm chart
│   ├── Chart.yaml
│   ├── values.yaml
│   └── templates/
│       ├── deployment.yaml
│       ├── service.yaml
│       ├── configmap.yaml
│       ├── secret.yaml
│       └── hpa.yaml
│
├── terraform-infra/               # Terraform Infra
│   ├── backend.tf
│   ├── providers.tf
│   ├── variables.tf
│   ├── terraform.tfvars
│   ├── vpc.tf
│   ├── eks.tf
│   ├── eks-access.tf
│   ├── s3-dynamodb.tf
│   ├── outputs.tf
│   ├── versions.tf
│   └── module.eks/
│
├── k8s/                           # k8s docs manifests
│   ├── servicemonitor.yaml
│   ├── namespace.yaml
│   ├── ConfigMap.yaml
│   └── secret.yaml
│
└── documentation/
    ├── README.md
    ├── architecture.png
    └── Grafana Dashboard/
```

## Application Overview
Simple Node.js Todo app (in-memory store)
AngularJS frontend
Exposes:
/api/todos CRUD
/health (liveness/readiness)
/metrics (Prometheus metrics)

## Docker & Containerization

Dockerfile (Multi-stage)
•Stage 1: Builder (installs dependencies)
•Stage 2: Production image (non-root user, small size)
•Exposes port 3000
	
This ensures:
✔ Small image
✔ Faster deployments
✔ Production-grade setup

## CI/CD Pipeline (Jenkins)

Auto deployment configured using github webhook
Pipeline Stages
	1.	Checkout Code from GitHub
	2.	Install Dependencies & Run Tests using Jest
	3.	Generate Image Tag using Git commit SHA
	4.	Login to AWS ECR
	5.	Build Docker Image
	6.	Push to Amazon ECR
	7.	Deploy to Amazon EKS using Helm:
	•	Rolling updates
	•	Image updated automatically
	•	Pull policy Always

Why commit SHA tags?
	•	Ensures each deployment is unique
	•	Allows easy rollback
	•	Avoids caching issues with latest
	
## Kubernetes Deployment (via Helm Chart)

Includes  -


###ConfigMap

Contains:
•APP_ENV
•APP_NAME

###Secret

Contains:
•SECRET_KEY

###ServiceMonitor

Automatically scrapes /metrics and integrates into Prometheus.

### Pod networking
Pods communicate inside cluster via ClusterIP service
Pod to pod traffic flows inside VPC internally


##Terraform Infrastructure

All infra is created using Terraform:

Resources Created
•VPC (public + private subnets)
•Internet Gateway + NAT
•EKS Cluster
•EKS Node Group
•S3 Bucket (remote backend)
•DynamoDB Table (Terraform state locking)

###Remote Backend Configuration

Located in backend.tf:
•Stores Terraform state in S3
•Uses DynamoDB for state locking

Benefits:
✔ No local state
✔ Team-safe
✔ Prevents parallel runs and corruption

##Monitoring (Prometheus + Grafana)

###Installed Using Helm:
•kube-prometheus-stack

What is monitored?
•Pod CPU/Memory
•Node health
•Application metrics:
 •HTTP request counter
 •Status codes
 •Routes
 •Methods

###Grafana Dashboard
•Application Requests panel
•Pod resource usage
•Node resource usage

Screenshots included in /documentation/monitoring-dashboard.png.

##Architecture Diagram



##Few Troubleshooting & Issues faced
 •Webhook was not able to pick from app folder as it was uploaded as a sub repo inside the github repo
 •Fix - Deleted the .git folder inside the app folder
 •Was locked out of EKS cluster(couldnt authconfig) as hadnt given admin access to IAM principal when creating the cluster. Wasnt a part of RBAC. No RBAC mapping for the identity I was using.
 •Fix - Destroyed the cluster and created it again with an eks-access.tf with aws_eks_access_entry and then applied it again. 
 •Jenkins Pipeline failures
 •Missing npm
 •Fix - Installed npm on Jenkins server locally
 •Prometheus ServiceMonitor not picking up application metrics
 •Fix - labeled service correctly + added release=prom and it started picking
 •Latest tag issue- Even when new build was pushed, it wasnt picking up due to IfNotPresent policy. Changed it to always but when the app crashed it ws still getting stuck and new build wasnt getting pushed because maximum pods was 3, minimum pods were 2. 2 were healthy and one was in crashloopbackoff. So new container wasnt being made. 
 •Fix - Removed latest tagging and added image tagging with commit SHA id. Then it started pulling images correctly and accurately

##How to run locally 

docker build -t todoapp .
docker run -p 3000:3000 todoapp

## How to deploy using Jenkins

Trigger a push to Github -> Jenkins
automatically builds, tests, pushes, deploys.

##Conclusion

This project covers:
✔ CI/CD
✔ Docker
✔ Kubernetes
✔ Helm
✔ Monitoring
✔ Terraform Infra Provisioning
✔ Prometheus Metrics
✔ Grafana Dashboards
✔ Secrets/ConfigMaps
✔ Rolling Updates
✔ Remote Backend (S3 + DynamoDB)

