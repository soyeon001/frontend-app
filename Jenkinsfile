pipeline {
    agent any

    tools {
        nodejs 'node22'
    }

    environment {
        SCANNER_HOME = tool 'sonar-scanner'
        AWS_ACCESS_KEY_ID = credentials('AWS_ACCESS_KEY_ID')
        AWS_SECRET_ACCESS_KEY = credentials('AWS_SECRET_ACCESS_KEY')
        AWS_DEFAULT_REGION = "ap-northeast-2"
        S3_BUCKET = 's3://www.homeow.site'
    }

    stages {
        stage('Git Checkout') {
            steps {
                git branch: 'main', credentialsId: 'GITHUB_TOKEN', url: 'https://github.com/soyeon001/frontend-app.git'
            }
        }

        stage('Install Package Dependencies') {
            steps {
                dir('frontend-app'){ 
                    sh 'npm install'
                }
                // sh 'cd ./frontend-app/'
                // sh 'pwd'
                
            }
        }

        stage('Trivy FS Scan') {
            steps {
                sh 'trivy fs --format table -o fs-report-${BUILD_NUMBER}.html .'
            }
        }

        stage('SonarQube') {
            steps {
                withSonarQubeEnv('sonarqube') {
                    sh '${SCANNER_HOME}/bin/sonar-scanner -Dsonar.projectKey="frontend-app" -Dsonar.projectName="frontend-app"'
                }
            }
        }

        stage('Build React Application') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Deploy to S3') {
            steps {
                sh 'aws s3 sync build/ ${S3_BUCKET} --delete'
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: '*.html', fingerprint: true
            cleanWs()
        }
        success {
            slackSend (color: '#36A64F', message: "SUCCESS: Your React App (version : ${BUILD_NUMBER}) CI / CD completed successfully.")
        }
        failure {
            slackSend (color: '#FF0000', message: "FAILURE: Your React App (version : ${BUILD_NUMBER}) CI / CD failed. Check Jenkins logs for more details.")
        }
    }
}