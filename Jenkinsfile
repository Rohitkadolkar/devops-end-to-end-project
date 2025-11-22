pipeline {
    agent any

    environment {
        AWS_REGION = "ap-south-1"
        IMAGE = "604245833114.dkr.ecr.ap-south-1.amazonaws.com/todoapp:latest"
        CHART_PATH = "todo-app/"
    }

    stages {

        stage('Checkout Code') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/Rohitkadolkar/devops-end-to-end-project.git'
            }
        }

        stage('Login to ECR') {
            steps {
                sh '''
                aws configure set default.region ${AWS_REGION}
                
                aws ecr get-login-password --region ${AWS_REGION} \
                    | docker login --username AWS --password-stdin 604245833114.dkr.ecr.ap-south-1.amazonaws.com
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '''
                docker build -t todoapp ./app
                docker tag todoapp:latest ${IMAGE}
                '''
            }
        }

        stage('Push to ECR') {
            steps {
                sh '''
                docker push ${IMAGE}
                '''
            }
        }

        stage('Deploy to EKS with Helm') {
            steps {
                sh '''
                aws eks update-kubeconfig --name devops-eks --region ${AWS_REGION}

                helm upgrade --install todoapp ${CHART_PATH} \
                    --set image.repository=604245833114.dkr.ecr.ap-south-1.amazonaws.com/todoapp \
                    --set image.tag=latest
                '''
            }
        }

    }
}
