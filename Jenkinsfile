pipeline {
  agent any

  environment {
    CI = 'true'
  }

  stages {
    stage('Install Dependencies') {
      steps {
        script {
          bat 'npm install'
        }
      }
    }

    stage('Install Playwright Browsers') {
      steps {
        script {
          bat 'npx playwright install --with-deps'
        }
      }
    }

    stage('Run Playwright Tests') {
      steps {
        script {
          bat 'npx playwright test'
        }
      }
    }

    stage('Generate AI Failure Summary') {
      steps {
        script {
          bat 'node scripts/generate-ai-summary.js'
        }
      }
    }
  }

  post {
    always {
      archiveArtifacts artifacts: 'playwright-report/**, jsonReports/**, reports/**, test-results/**', allowEmptyArchive: true
      publishHTML(target: [
        allowMissing: true,
        alwaysLinkToLastBuild: true,
        keepAll: true,
        reportDir: 'playwright-report',
        reportFiles: 'index.html',
        reportName: 'Playwright HTML Report'
      ])
    }
    failure {
      echo 'Playwright tests failed. Check the archived reports and screenshots.'
    }
  }
}
