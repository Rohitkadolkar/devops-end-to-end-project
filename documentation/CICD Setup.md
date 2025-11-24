### CI/CD Setup
```
• Create EC2 in public subnet for Jenkins and install Java, Docker and Jenkins
• You can follow this documentation - https://www.jenkins.io/doc/book/installing/linux/
• Assign IAM role to Jenkins for accessing EKS 
• Login to Jenkins
• Create Jenkins job
• Add Jenkinsfile from repo
• Add GitHub Webhook
• Add AWS credentials + install Docker + Node + npm on Jenkins server

The Jenkins pipeline performs the following stages:

1. *Checkout Code*  
   Pulls the latest code from GitHub main branch.

2. *Run Tests*  
   Installs dependencies and runs Jest unit tests inside app/test.

3. *Generate Image Tag*  
   Uses git commit id --short HEAD to generate a unique immutable tag.

4. *Login to AWS ECR*  
   Jenkins authenticates using aws ecr get-login-password.

5. *Build Docker Image*  
   Uses Dockerfile (multi-stage optimized build).

6. *Push to ECR*  
   Uploads image with commit SHA tags.

7. *Deploy to EKS using Helm*  
   Helm updates:
   - Deployment
   - ConfigMap
   - Secret
   - Service
   - HPA  
   with rolling updates enabled.

8. *Auto Deployment Trigger*  
   GitHub Webhook triggers Jenkins automatically for every push.
   
```
