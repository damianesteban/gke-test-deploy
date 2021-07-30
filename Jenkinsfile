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
        shortCommit = sh(returnStdout: true, script: "git log -n 1 --pretty=format:'%h'").trim()
        // ! TODO: Add script to get application version from package.json + application name.
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
                    myapp = docker.build("bhc.jfrog.io/docker/webapp:${ENVIRONMENT}-${env.BUILD_ID}-${shortCommit}")
                }
            }
        }

        stage("Push image") {
            steps {
                script {
                    docker.withRegistry('https://bhc.jfrog.io/docker/', 'artifactory-creds') {
                            myapp.push("latest")
                            myapp.push("${ENVIRONMENT}-${env.BUILD_ID}-${shortCommit}")
                    }
                }
            }
        }

        stage('Upload build to Jfrog') {
            steps {
                script {
                    rtUpload(
                    buildName: "webapp-${ENVIRONMENT}-${env.BUILD_ID}-${shortCommit}",
                    buildNumber: "${env.BUILD_NUMBER}",
                    serverId: 'artifactory-server'
                  )
                }
                script {
                  rtPublishBuildInfo (
                      serverId: 'artifactory-server',
                      // If the build name and build number are not set here, the current job name and number will be used. Make sure to use the same value used in the rtDockerPull and/or rtDockerPush steps.
                      buildName: "webapp-${ENVIRONMENT}-${env.BUILD_ID}-${shortCommit}",
                      buildNumber: "${env.BUILD_NUMBER}",
                      // Optional - Only if this build is associated with a project in Artifactory, set the project key as follows.
                    )
                }
            }
        }

        stage('Add interactive promotion') {
            steps {
                rtAddInteractivePromotion (
                    //Mandatory parameter
                    serverId: 'artifactory-server',

                    //Optional parameters
                    targetRepo: 'https://bhc.jfrog.io/docker-prod-local/',
                    displayName: 'Promote me please',
                    buildName: "webapp-${ENVIRONMENT}-${env.BUILD_ID}-${shortCommit}",
                    buildNumber: "${env.BUILD_NUMBER}",
                    comment: 'this is the promotion comment',
                    sourceRepo: 'https://bhc.jfrog.io/docker-staging-local/',
                    status: 'Released',
                    includeDependencies: true,
                    failFast: true,
                    copy: true
                )
            }
        }
    }    
    post {
        always {
            echo 'Pipeline completed successfully'
            cleanWs(cleanWhenNotBuilt: false,
                    deleteDirs: true,
                    disableDeferredWipeout: true,
                    notFailBuild: true,
                    patterns: [[pattern: '.gitignore', type: 'INCLUDE'],
                               [pattern: '.propsfile', type: 'EXCLUDE']])
        }
    }
}