library('jenkins-devops-libs')

def gitTag = null
def imageTag = null

def developmentRepository = 'betterptdev'
def stagingRepository = 'betterptstaging'
def productionRepository = 'betterptproduction'
def imageApplicationName = 'webapp'

pipeline {

    agent any

    // nodejs plugin
    tools { nodejs "node" }

    environment {
        // Grabs the 
        shortCommit = sh(returnStdout: true, script: "git log -1 --pretty=%H").trim()
        GH_TOKEN = credentials('github-token')
        NPM_TOKEN = credentials('npm-token')
        dockerImage = ""
    }

    stages {
        // Verify yarn is installed
        stage("Check yarn install") {
            steps {
                sh "yarn versions"
            }
        }

        // Checkout code from git and get git tag
        stage("Checkout code from git") {
            steps {
                checkout scm
                script {
                    gitTag = sh(returnStdout: true, script: "git tag --contains | head -1").trim()
                    echo "GIT TAG: ${gitTag}"
                }
            }
        }

        // Runs applicaion tests
        stage("Run application tests") {
            steps {
                sh 'yarn install && yarn test'
            }
        }

        // Sets the image tag based on the git tag and git commit hash
        stage("Tag the image") {
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

        // Builds the docker image
        stage("Build image") {
            steps {
                script {
                    dockerImage = docker.build "${developmentRepository}/${imageApplicationName}:${imageTag}"
                }
            }
        }

        stage('Application Testing') {
            steps {
                script {
                    dockerImage.inside {
                        sh 'yarn test'
                    }
                }
            }
        }

        // ! NOTE: Example of Image Verification
        // ! NOTE: goss and dgoss need to installed on the host or in a container.
        stage('Image Verification') {
            steps {
                script {
                    sh(returnStdout: true, script: "dgoss run -p 5000:5000 ${developmentRepository}/${imageApplicationName}:${imageTag}")  
              }
            }
        }

        // Pushes the image to the registry twice - once with the latest tag and once with the image tag
        // This should be pushed to a different registry based on the environment - dev, staging, pr production.
        stage("Push image to registry") {  
            steps {
                script {
                    docker.withRegistry('', 'dockerhub') {
                        dockerImage.push()
                        dockerImage.push("latest")
                    }
                }
            }
        }

        stage('Push to Github') {
            steps {
                script {
                    echo 'Running Semantic Release!'
                    sh 'npx semantic-release --debug'
                }
            }
        }




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
