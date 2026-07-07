# Security Policy

## Supported Versions

This project deploys continuously from the `main` branch. Only the latest deployed version at https://shiritori-game-ccaae.web.app is supported with security fixes.

## Reporting a Vulnerability

If you discover a security vulnerability in this project, please report it privately rather than opening a public GitHub issue:

1. Use GitHub's "Report a vulnerability" feature under the Security tab of this repository (Security Advisories), or
2. 2. Contact the repository owner directly via their GitHub profile.
  
   3. Please include:
  
   4. - A description of the vulnerability and its potential impact
      - - Steps to reproduce the issue
        - - Any relevant logs, screenshots, or proof-of-concept code
         
          - We will acknowledge reports as soon as possible and aim to provide a fix or mitigation in a timely manner. Please allow a reasonable amount of time for a response before disclosing the issue publicly.
         
          - ## Scope
         
          - This policy covers the code in this repository, including all app folders (`shiritori-online`, `kawaii-shiritori`, `shiritori-word-chain`, `shiritori-v1`) and the GitHub Actions workflows used to build, test, and deploy the project.
         
          - ## Secrets and Credentials
         
          - This repository uses GitHub Actions secrets (e.g. `FIREBASE_TOKEN`) for deployment. Secrets must never be committed to the repository in plaintext. If you find a committed secret, please report it using the process above so it can be rotated immediately.
          - 
