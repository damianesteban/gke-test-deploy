// library('jenkins-devops-libs')

pipeline {
    agent any
    environment {
        PROJECT_ID = 'wompy-318104'
        CLUSTER_NAME = 'silly-cluster'
        LOCATION = 'us-east1-d'
        CREDENTIALS_ID = 'gke'
        ENVIRONMENT = 'development'
        // Script to get the most recent git commit hash (short hash)
        shortCommit = sh(returnStdout: true, script: "git log -1 --pretty=%H").trim()
        tag = sh(returnStdout: true, script: "git tag --contains | head -1").trim()
        SERVICE_NAME = 'patient-service'
        SOURCE_REPO = 'docker-development-local'
        TARGET_REPO = 'docker-staging-local'
        // ! TODO: Add script to get application
        // version from package.json + application name.
    }
    stages {
        stage('Artifactory Configuration') {
            steps {
                rtServer(
                    id: 'artifactory-server',
                    credentialsId: 'artifactory-lp'
                )
            }
        }

        stage("Checkout code") {
            steps {
                checkout scm
            }
        }

        stage("Build and push") {
            steps {
                script {
                    docker.withRegistry('https://bhc.jfrog.io', 'artifactory-lp') {
                      def customImage = docker.build("docker-development-local/webapp:development-${shortCommit}")
                      customImage.push()
                      customImage.push('latest')
                    }
                }
            }
        }

        stage('Publish build to Jfrog') {
            steps {
                script {
                    rtPublishBuildInfo (
                        serverId: 'artifactory-server',
                    )
                }
            }
        }

        stage('Promote') {
    
            steps {
                script {
                    rtPromote (
                        serverId: 'artifactory-server',
                        targetRepo: TARGET_REPO,
                        sourceRepo: SOURCE_REPO
                    )
                }
            }
        }

        stage('Retag and Push') {
            def image
            steps {
                script {

                    sh 'curl -u damian@betterpt.com:RxScala1979! -X POST "https://bhc.jfrog.io/api/docker/docker-development-local/v2/promote" -H "Content-Type: application/json" -d
                        '{"dockerRepository": "docker-development-local/webapp",
                        "targetRepo": "docker-staging-local",
                        "tag": "development-${shortCommit}",
                        "targetTag": "staging-${shortCommit}"
                    }''
                    // docker.withRegistry('https://bhc.jfrog.io/docker-development-local', 'artifactory-lp') {
                    //     image = docker.image('webapp:development-${shortCommit}')
                    //     image.pull()
                        
                    // }
                    
                }
            }   
        }
    //     stage('Push to Docker Staging') {
    //         script {
    //             docker.withRegistry('https://bhc.jfrog.io', 'artifactory-lp') {
        //             def customImage = docker.pull("docker-/webapp:${shortCommit}")
        //                   customImage.push('latest')
    //         }
    //     }
    }  
}
