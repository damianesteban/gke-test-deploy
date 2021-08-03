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
        tag = sh(returnStdout: true, script: "git tag --contains | head -1").trim()
        SERVICE_NAME = 'patient-service'
        // ! TODO: Add script to get application version from package.json + application name.
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
        stage("Build image") {
            steps {
                script {
                    docker.build("bhc.jfrog.io/docker-staging-local/webapp:${SERVICE_NAME}-${ENVIRONMENT}-${env.BUILD_ID}-${shortCommit}")
                }
            }
        }
        stage("Push image") {
            steps {
                rtDockerPush(
                    serverId: 'artifactory-server',
                    image: "bhc.jfrog.io/docker-staging-local/webapp:${SERVICE_NAME}-${ENVIRONMENT}-${env.BUILD_ID}-${shortCommit}",
                    targetRepo: 'docker-staging-local',
                    // Attach custom properties to the published artifacts:
                    properties: 'project-name=webapp;status=stable;silly=true',
                )
            }
        }

        stage('Upload build to Jfrog') {
            steps {
                script {
                    rtUpload(
                    buildName: "webapp-${SERVICE_NAME}-${ENVIRONMENT}-${env.BUILD_ID}-${shortCommit}",
                    buildNumber: "${env.BUILD_NUMBER}",
                    serverId: 'artifactory-server'
                  )
                }
                script {
                  rtPublishBuildInfo (
                      serverId: 'artifactory-server',
                      // If the build name and build number are not set here, the current job name and number will be used. Make sure to use the same value used in the rtDockerPull and/or rtDockerPush steps.
                      buildName: "webapp-${SERVICE_NAME}-${ENVIRONMENT}-${env.BUILD_ID}-${shortCommit}",
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
                    targetRepo: 'bhc.jfrog.io/docker-prod-local/webapp',
                    displayName: 'Promote me please',
                    buildName: "webapp-${SERVICE_NAME}-${ENVIRONMENT}-${env.BUILD_ID}-${shortCommit}",
                    buildNumber: "${env.BUILD_NUMBER}",
                    comment: 'this is the promotion comment',
                    sourceRepo: 'bhc.jfrog.io/docker-staging-local/webapp',
                    status: 'Released',
                    includeDependencies: false,
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
