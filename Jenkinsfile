def artifactoryServerId = 'artifactory-server'
def artifactoryServerUrl = 'https://bhc.jfrog.io/artifactory'
def artifactoryServerCredentialsId = 'artifactory-lp'
def artifactoryDevelopmentRepository = 'docker-development-local'
def artifactoryStagingRepository = 'docker-staging-local'
def artifactoryProductionRepository = 'docker-production-local'
def artifactoryDockerRegistry = 'bhc.jfrog.io'
def imageName = 'webapp'

pipeline {

    agent any
    environment {
        shortCommit = sh(returnStdout: true, script: "git log -1 --pretty=%H").trim()
        tag = sh(returnStdout: true, script: "git tag --contains | head -1").trim()
    }

    stages {
        stage("Checkout code") {
            steps {
                checkout scm
            }
        }
        // Configures the Artifactory server
        stage('Artifactory configuration') {
            steps {
                rtServer(
                    id: artifactoryServerId,
                    url: artifactoryServerUrl,
                    credentialsId: artifactoryServerCredentialsId
                )
            }
        }

        // Builds the image. Of coure we don't need to use the Artifactory methods here if we don't want to
        stage('Build docker image') {
            steps {
                script {
                    docker.build(artifactoryDockerRegistry + "/docker-development-local/" + imageName + ":${shortCommit}")
                }
            }
        }

        // Pushes the image to the Artifactory server
        stage('Push Image to Artifactory') {
            steps {
                rtDockerPush(
                    serverId: artifactoryServerId,
                    image: artifactoryDockerRegistry + "/docker-development-local/" + imageName + ":${shortCommit}",
                    targetRepo: artifactoryDevelopmentRepository
                )
            }
        }

        // Publishes the build info to Artifactory
        stage('Publish build info') {
            steps {
                rtPublishBuildInfo(
                    serverId: artifactoryServerId
                )
            }
        }

        // ! NOTE: We don't have Xray Scan with the free version.
        // stage('Xray scan') {
        //     steps {
        //         xrayScan(
        //             serverId: artifactoryServerId,
        //             failBuild: true
        //         )
        //     }
        // }

        // Promotion Step. This removes the image from the development docker repo and pushesd it to the staging docker repo.
        // There can also be a manual promotion step here.
        stage ('Promotion') {
            steps {
                // rtPromote (
                //     serverId: artifactoryServerId,
                //     targetRepo: artifactoryStagingRepository,
                //     sourceRepo: artifactoryDevelopmentRepository
                // )
                rtAddInteractivePromotion(
                    serverId: artifactoryServerId,
                    targetRepo: artifactoryStagingRepository,
                    sourceRepo: artifactoryDevelopmentRepository
                )
            }
        }

        stage('Deploy') {
            steps {
                 sh "sed -i 's/webapp:latest/webapp:${shortCommit}/g' deployment.yaml"
                step([$class: 'KubernetesEngineBuilder', projectId: env.PROJECT_ID, clusterName: env.CLUSTER_NAME, location: env.LOCATION, manifestPattern: 'deployment.yaml', credentialsId: env.CREDENTIALS_ID, verifyDeployments: true])
            }
        }
    }
}
