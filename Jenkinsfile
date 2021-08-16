def gitTag = null
def imageTag = null
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
    }

    stages {

        stage("Checkout code") {
            steps {
                checkout scm
                script {
                    gitTag = sh(returnStdout: true, script: "git tag --contains | head -1").trim()
                    echo "GIT TAG: ${gitTag}"

                }
            }
        }

        stage("Determine if image is tagged") {
            steps {
                script {
                    if (gitTag != null) {
                        imageTag = gitTag + "-" + shortCommit
                        echo "FULL IMAGE TAG: ${imageTag}"
                    } else {
                        imageTag = "no-tag""-" + shortCommit
                        echo "FULL IMAGE TAG: ${imageTag}"
                    }
                }
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
                    docker.build(artifactoryDockerRegistry + "/docker-development-local/" + imageName + ":${imageTag}")
                }
            }
        }

        // Pushes the image to the Artifactory server
        stage('Push Versioned Image to Artifactory') {
            steps {
                rtDockerPush(
                    serverId: artifactoryServerId,
                    image: artifactoryDockerRegistry + "/docker-development-local/" + imageName + ":${imageTag}",
                    targetRepo: artifactoryDevelopmentRepository
                )

            }
        }

        stage('Push latest Image to Artifactory') {
            steps {
                rtDockerPush(
                    serverId: artifactoryServerId,
                    image: artifactoryDockerRegistry + "/docker-development-local/" + imageName + ":latest",
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

        // Promotion Step. This removes the image from the development docker repo and pushes it to the staging docker repo.
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

        // stage('Deploy') {
        //     steps {
        //          sh "sed -i 's/webapp:latest/webapp:${shortCommit}/g' deployment.yaml"
        //          sh "cat deployment.yaml"
        //         step([$class: 'KubernetesEngineBuilder', projectId: 'wompy-318104', clusterName: 'silly-cluster', location: 'us-east1-d', manifestPattern: 'deployment.yaml', credentialsId: 'gke', verifyDeployments: true])
        //     }
        // }
    }
}
