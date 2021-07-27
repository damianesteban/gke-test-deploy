pipeline {
    agent any
    environment {
        PROJECT_ID = 'wompy-318104'
        CLUSTER_NAME = 'silly-cluster'
        LOCATION = 'us-east1-d'
        CREDENTIALS_ID = 'gke'
    }
    stages {
        stage("Checkout code") {
            steps {
                checkout scm
            }
        }
        stage("Build image") {
            steps {
                script {
                    myapp = docker.build("bhc.jfrog.io/docker-development/jenk-test:${env.BUILD_ID}")
                }
            }
        }
        stage("Push image") {
            steps {
                script {
                    docker.withRegistry('https://bhc.jfrog.io/docker-development/', 'jfrog') {
                            myapp.push("latest")
                            myapp.push("${env.BUILD_ID}")
                    }
                }
            }
        }
        stage('Upload build to Jfrog') {
            steps {
                script {
                    rtUpload(
                    buildName: "jenk-test-development-${env.BUILD_ID}",
                    buildNumber: "${env.BUILD_NUMBER}",
                    serverId: 'jfrog'
                  )
                }
                script {
                  rtPublishBuildInfo (
                      serverId: 'jfrog',
                      // If the build name and build number are not set here, the current job name and number will be used. Make sure to use the same value used in the rtDockerPull and/or rtDockerPush steps.
                      buildName: "jenk-test-development-${env.BUILD_ID}",
                      buildNumber: "${env.BUILD_NUMBER}",
                      // Optional - Only if this build is associated with a project in Artifactory, set the project key as follows.
                    )
                }
            }
        }
        stage('Deploy to GKE') {
            steps{
                sh "sed -i 's/jenk-test:latest/jenk-test:${env.BUILD_ID}/g' deployment.yaml"
                step([$class: 'KubernetesEngineBuilder', projectId: env.PROJECT_ID, clusterName: env.CLUSTER_NAME, location: env.LOCATION, manifestPattern: 'deployment.yaml', credentialsId: env.CREDENTIALS_ID, verifyDeployments: true])
            }
        }
    }    
}