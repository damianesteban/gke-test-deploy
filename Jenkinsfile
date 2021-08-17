def gitTag = null
def imageTag = null
def artifactoryServerId = 'artifactory-server'
def artifactoryServerUrl = 'https://bhc.jfrog.io/artifactory'
def artifactoryServerCredentialsId = 'artifactory-lp'

// ! NOTE: These should be ENV vatiables, i.e. "docker-${env.Stage}-local"
def artifactoryDevelopmentRepository = 'docker-development-local'
def artifactoryStagingRepository = 'docker-staging-local'
def artifactoryProductionRepository = 'docker-production-local'
def artifactoryDockerRegistry = 'bhc.jfrog.io'
def imageName = 'betterptdev/webapp'

pipeline {

    agent any

    tools { nodejs "node" }

    environment {
        // Grabs the 
        shortCommit = sh(returnStdout: true, script: "git log -1 --pretty=%H").trim()
        GH_TOKEN = credentials('github-token')
        NPM_TOKEN = credentials('npm-token')
        dockerImage = ""
    }

    stages {

        stage("Check yarn install") {
            steps {
                sh "yarn versions"
            }
        }

        stage("Checkout code from git") {
            steps {
                checkout scm
                script {
                    gitTag = sh(returnStdout: true, script: "git tag --contains | head -1").trim()
                    echo "GIT TAG: ${gitTag}"
                }
            }
        }

        stage("Run application tests") {
            steps {
                sh 'yarn install && yarn test'
            }
        }

        // Sets the image tag based on the git tag
        stage("Determine if image is tagged") {
            steps {
                script {
                    if (gitTag != "") {
                        imageTag = gitTag + "-" + shortCommit
                        echo "FULL IMAGE TAG, TAG PRESENT: ${imageTag}"
                    } else {
                        imageTag = "no-tag" + "-" + shortCommit
                        echo "FULL IMAGE TAG, NO TAG PRESENT: ${imageTag}"
                    }
                }
            }
        }

        stage("Build image") {
            steps {
                script {
                    dockerImage = docker.build imageName
                }
                
            }
        }

        stage("Push image to registry") {  
            steps {
                script {
                    docker.withRegistry('', 'dockerhub') {
                        dockerImage.push("${imageTag}")
                        dockerImage.push("latest")
                    }
                }
            }
        }
        // // Configures the Artifactory server
        // stage('Artifactory configuration') {
        //     steps {
        //         rtServer(
        //             id: artifactoryServerId,
        //             url: artifactoryServerUrl,
        //             credentialsId: artifactoryServerCredentialsId
        //         )
        //     }
        // }

        // // Builds the image. Of coure we don't need to use the Artifactory methods here if we don't want to
        // stage('Build docker image') {
        //     steps {
        //         script {
        //             docker.build(artifactoryDockerRegistry + "/docker-development-local/" + imageName + ":${imageTag}")
        //         }
        //     }
        // }

        // ! NOTE: Example of Image Verification
        // ! NOTE: This step is commented out, goss needs to be installed on the Jenkins cluster
        // stage('Image Verification') {
        //     steps {
        //         script {
        //             sh(returnStdout: true, script: "dgoss run -p 5000:5000 /docker-development-local/" + imageName + ":${imageTag}")  
        //       }
        //     }
        // }
        

        // Pushes the image to the Artifactory server
        // stage('Push Versioned Image to Artifactory') {
        //     steps {
        //         rtDockerPush(
        //             serverId: artifactoryServerId,
        //             image: artifactoryDockerRegistry + "/docker-development-local/" + imageName + ":${imageTag}",
        //             targetRepo: artifactoryDevelopmentRepository
        //         )

        //     }
        // }

        // stage('Push latest Image to Artifactory') {
        //     steps {
        //         rtDockerPush(
        //             serverId: artifactoryServerId,
        //             image: artifactoryDockerRegistry + "/docker-development-local/" + imageName + ":latest",
        //             targetRepo: artifactoryDevelopmentRepository
        //         )
        //     }
        // }

        // // Publishes the build info to Artifactory
        // stage('Publish build info') {
        //     steps {
        //         rtPublishBuildInfo(
        //             serverId: artifactoryServerId
        //         )
        //     }
        // }

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
        // Manual promotion seems to work, but it does not fire off a webhook when it is promoted to staging.
        // stage ('Promotion') {
        //     steps {
        //         // rtPromote (
        //         //     serverId: artifactoryServerId,
        //         //     targetRepo: artifactoryStagingRepository,
        //         //     sourceRepo: artifactoryDevelopmentRepository
        //         // )
        //         rtAddInteractivePromotion(
        //             serverId: artifactoryServerId,
        //             targetRepo: artifactoryStagingRepository,
        //             sourceRepo: artifactoryDevelopmentRepository
        //         )
        //     }
        // }

        // ! NOTE: Deployment is with Helm, this is just a placeholder
        // stage('Deploy') {
        //     steps {
        //          sh "sed -i 's/webapp:latest/webapp:${imageTag}/g' deployment.yaml"
        //          sh "cat deployment.yaml"
        //         step([$class: 'KubernetesEngineBuilder', projectId: 'wompy-318104', clusterName: 'silly-cluster', location: 'us-east1-d', manifestPattern: 'deployment.yaml', credentialsId: 'gke', verifyDeployments: true])
        //     }
        // }
    }
}
