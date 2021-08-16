 # Test App

  ## Resources

  -  [Jenkins Pipeline for Containerized...](https://shadow-soft.com/jenkins-pipeline-containerized-applications-kubernetes/)
  - [jenkins example workflows](https://github.com/kingdonb/jenkins-example-workflow)
  - [jenkins kubernetes pipeline, Jenkins + Helm](https://github.com/eldada/jenkins-pipeline-kubernetes)
  - [Jenkins Artifactory Plug-in](https://www.jfrog.com/confluence/display/JFROG/Jenkins+Artifactory+Plug-in)
  - [JFrog Training, Kubernetes using Artifactory, Jenkins and Helm example](https://github.com/jfrogtraining/kubernetes_example)
  - [Keel - Kubernetes](https://keel.sh/)
  - [goss](https://github.com/aelsabbahy/goss)
  - [dgoss](https://github.com/aelsabbahy/dgoss-examples)


## CI/CD Steps

**NOTE:** The Jenkins Pipeline is triggered when a new tag is created, this can be done manually as well.

- When a new PR is submitted
  - Github Actions
    - Run Tests
    - Create Release and Tag from Semantic Release. (tag can be pushed manually at this step)
  - Jenkins Pre-Deploy Pipeline
    - Grabs the git tag
    - Builds the image
    - Tags the image
    - Runs Image Verification
    - Pushes Image to AWS ECR
    - Manual Approval Step is created
  - Manual Approval
    - Yes/No
    - Helm version (from image tag) is pushed to repository.
    - Deployment with Helm
  - Jenkins Post-Deploy Pipeline
    - Post-deploy Actions
    - On successful Deploy, submits a PR to the git branch associated with the next environment. (i.e. to staging)
  - Start Over

 This is a test project for GKE, Jenkins, and friends.
