def artifactoryServerId = 'artifactory-server'
def artifactoryServerUrl = 'https://bhc.jfrog.io/artifactory'
def artifactoryServerCredentialsId = 'artifactory-lp'
def artifactoryRepository = 'docker-development-local'
def artifactoryPromotedRepository = 'docker-staging-local'
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
        
        stage('Artifactory configuration') {
            steps {
                rtServer(
                    id: artifactoryServerId,
                    url: artifactoryServerUrl,
                    credentialsId: artifactoryServerCredentialsId
                )
            }
        }


        stage('Build docker image') {
            steps {
                script {
                    docker.build(artifactoryDockerRegistry + "/docker-development-local/" + imageName + ":development-${shortCommit}")
                }
            }
        }
        stage('Push Image to Artifactory') {
            steps {
                rtDockerPush(
                    serverId: artifactoryServerId,
                    image: artifactoryDockerRegistry + "/docker-development-local/" + imageName + ":development-${shortCommit}",
                    targetRepo: artifactoryRepository
                )
            }
        }
        stage('Publish build info') {
            steps {
                rtPublishBuildInfo(
                    serverId: artifactoryServerId
                )
            }
        }
        // stage('Xray scan') {
        //     steps {
        //         xrayScan(
        //             serverId: artifactoryServerId,
        //             failBuild: true
        //         )
        //     }
        // }
        stage ('Promotion') {
            steps {
                rtPromote (
                    serverId: artifactoryServerId,
                    targetRepo: artifactoryPromotedRepository,
                    sourceRepo: artifactoryRepository
                )
            }
        }
    }
}
// // library('jenkins-devops-libs')

// pipeline {
//     agent any
//     environment {
//         PROJECT_ID = 'wompy-318104'
//         CLUSTER_NAME = 'silly-cluster'
//         LOCATION = 'us-east1-d'
//         CREDENTIALS_ID = 'gke'
//         ENVIRONMENT = 'development'
//         // Script to get the most recent git commit hash (short hash)
//         shortCommit = sh(returnStdout: true, script: "git log -1 --pretty=%H").trim()
//         tag = sh(returnStdout: true, script: "git tag --contains | head -1").trim()
//         SERVICE_NAME = 'patient-service'
//         SOURCE_REPO = 'docker-development-local'
//         TARGET_REPO = 'docker-staging-local'
//         // ! TODO: Add script to get application
//         // version from package.json + application name.
//     }
//     stages {
//         stage('Artifactory Configuration') {
//             steps {
//                 rtServer(
//                     id: 'artifactory-server',
//                     credentialsId: 'artifactory-lp'
//                 )
//             }
//         }

//         stage("Checkout code") {
//             steps {
//                 checkout scm
//             }
//         }

//         stage("Build and push") {
//             steps {
//                 script {
//                     docker.withRegistry('https://bhc.jfrog.io', 'artifactory-lp') {
//                       def customImage = docker.build("docker-development-local/webapp:development-${shortCommit}")
//                       customImage.push()
//                       customImage.push('latest')
//                     }
//                 }
//             }
//         }

//         stage('Publish build to Jfrog') {
//             steps {
//                 script {
//                     rtPublishBuildInfo (
//                         serverId: 'artifactory-server',
//                     )
//                 }
//             }
//         }

//         stage('Promote') {
    
//             steps {
//                 script {
//                     rtPromote (
//                         serverId: 'artifactory-server',
//                         targetRepo: TARGET_REPO,
//                         sourceRepo: SOURCE_REPO
//                     )
//                 }
//             }
//         }

//         stage('Retag and Push') {
//             steps {
//                 script {
//                     sh """ curl -u damian@betterpt.com:RxScala1979! -X POST "https://bhc.jfrog.io/artifactory/api/docker/docker-staging-local/v2/promote" -H "Content-Type: application/json" -d '{"dockerRepository": "webapp", "targetRepo": "docker-staging-local", "tag": "development-${shortCommit}", "targetTag": "staging-${shortCommit}" }' """
//                     // // docker.withRegistry('https://bhc.jfrog.io/docker-development-local', 'artifactory-lp') {
//                     //     image = docker.image('webapp:development-${shortCommit}')
//                     //     image.pull()
                        
//                     // }
//                 }
//             }   
//         }
//     }  
// }
