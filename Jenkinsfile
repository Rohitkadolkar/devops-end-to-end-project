pipeline {
    agent any

    environment {
        AWS_REGION = "ap-south-1"
        AWS_ACCOUNT = "604245833114"
        REPO_NAME = "todoapp"
        CHART_PATH = "todo-app/"
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
                    IMAGE_TAG = sh(script: "git rev-parse --short HEAD", returnStdout: true).trim()
                    IMAGE = "${AWS_ACCOUNT}.dkr.ecr.${AWS_REGION}.amazonaws.com/${REPO_NAME}:${IMAGE_TAG}"
                    echo "Using Image Tag: ${IMAGE_TAG}"
                }
            }
        }

        stage('Login to ECR') {
            steps {
                sh '''
                aws configure set default.region ${AWS_REGION}
                aws ecr get-login-password --region ${AWS_REGION} \
                    | docker login --username AWS --password-stdin ${AWS_ACCOUNT}.dkr.ecr.${AWS_REGION}.amazonaws.com
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '''
                docker build -t todoapp:${IMAGE_TAG} ./app
                docker tag todoapp:${IMAGE_TAG} ${IMAGE}
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
                    --namespace testprod \
                    --set image.repository=${AWS_ACCOUNT}.dkr.ecr.${AWS_REGION}.amazonaws.com/${REPO_NAME} \
                    --set image.tag=${IMAGE_TAG} \
                    --set image.pullPolicy=Always
                '''
            }
        }
    }
}
