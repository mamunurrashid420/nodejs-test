# Jenkins-pipeline

# Node.js CI/CD Deployment with Jenkins

This project uses a Jenkins pipeline to automatically deploy a Node.js application to a remote Ubuntu server over SSH.

## 🚀 Deployment Overview

The pipeline performs the following steps:

1. **Clone Repository** – Clones the Node.js project from GitHub.
2. **Install Dependencies** – Installs all required Node modules.
3. **Build** – Builds the Node.js application (if applicable).
4. **Deploy to Remote Server** – Copies the build files to a remote server and lists the content to confirm deployment.

---

## 🔧 Requirements

- Jenkins installed and running.
- Jenkins agent has `ssh-agent` and `Node.js` installed.
- A valid private key `.ppk` or `.pem` uploaded to Jenkins under **Manage Jenkins > Credentials**.
- Remote server access with the key.
- Remote user has write access to the target deployment directory.

---
## Ubuntu/Linux use 
```
    sudo apt install putty-tools
    puttygen your-key.ppk -O private-openssh -o jenkins-key.pem
    chmod 600 jenkins-key.pem

```
## ✅ Step 2: Jenkins Credentials

1. Go to **Manage Jenkins > Credentials**.
2. Add a new credential of type **SSH Username with private key**.
3. Enter the remote server username and select the private key file.
4. ID should be `jenkins-ssh-key` for the pipeline to work.

## 🌐 Jenkins Pipeline Configuration

Here’s a sample `Jenkinsfile` used for the deployment:

```groovy
pipeline {
    agent any
    environment {
        REMOTE_HOST = "180.94.20.65"
        REMOTE_USER = "ubuntu"
        DEPLOY_PATH = "/home/ubuntu"
        NODE_VERSION = "20"
    }
    stages {
        stage('Clone Repository') {
            steps {
                checkout([$class: 'GitSCM',
                    branches: [[name: '*/main']],
                    userRemoteConfigs: [[
                        url: 'https://github.com/mamunurrashid420/nodejs-test.git'
                    ]]
                ])
            }
        }
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }
        stage('Build') {
            steps {
                sh 'npm run build || echo "No build script found"'
            }
        }
        stage('Deploy to Remote Server') {
            steps {
                sshagent(credentials: ['jenkins-ssh-key']) {
                    sh '''
                        echo "Creating deployment directory..."
                        ssh -o StrictHostKeyChecking=no $REMOTE_USER@$REMOTE_HOST "mkdir -p $DEPLOY_PATH"

                        echo "Copying files to remote server..."
                        scp -o StrictHostKeyChecking=no -r ./* $REMOTE_USER@$REMOTE_HOST:$DEPLOY_PATH/

                        echo "Deployment directory contents:"
                        ssh -o StrictHostKeyChecking=no $REMOTE_USER@$REMOTE_HOST "ls -la $DEPLOY_PATH"
                    '''
                }
            }
        }
    }
}

