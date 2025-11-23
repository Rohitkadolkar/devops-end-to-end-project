pipeline {
    agent any

    environment {
        AWS_REGION = "ap-south-1"
        ECR_REPO = "604245833114.dkr.ecr.ap-south-1.amazonaws.com/todoapp"
        CHART_PATH = "todo-app/"
        K8S_NAMESPACE = "testprod"
    }

    stages {

        stage('Checkout Code') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/Rohitkadolkar/devops-end-to-end-project.git'
            }
        }

        stage('Set Image Tag') {
            steps {
                script {
                    // Get short commit hash
                    IMAGE_TAG = sh(
                        script: "git rev-parse --short HEAD",
                        returnStdout: true
                    ).trim()

                    IMAGE = "${ECR_REPO}:${IMAGE_TAG}"

                    echo "Using Image Tag: ${IMAGE_TAG}"
                }
            }
        }

        stage('Login to ECR') {
            steps {
                sh '''
                aws configure set default.region ${AWS_REGION}
                
                aws ecr get-login-password --region ${AWS_REGION} \
                    | docker login --username AWS --password-stdin ${ECR_REPO}
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
                sh "docker push ${IMAGE}"
            }
        }

        stage('Deploy to EKS with Helm') {
            steps {
                sh '''
                aws eks update-kubeconfig --name devops-eks --region ${AWS_REGION}

                helm upgrade --install todoapp ${CHART_PATH} \
                    --namespace ${K8S_NAMESPACE} \
                    --set image.repository=${ECR_REPO} \
                    --set image.tag=${IMAGE_TAG}
                '''
            }
        }

    }
}
