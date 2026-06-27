# 🚀 CapitalX — Production Cloud Ecosystem on AWS

<p align="center">
  <img src="./assets/architecture.png" alt="CapitalX Architecture" width="100%">
</p>

<p align="center">
  <b>Full-Stack Investment Platform powered by AWS, Kubernetes, GitOps, CI/CD, Security & Observability</b>
</p>

<p align="center">
  <a href="https://github.com/aaftabparmar-DevOps-Eng/CapitalX">
    <img src="https://img.shields.io/badge/GitHub-CapitalX-181717?style=for-the-badge&logo=github">
  </a>
  <img src="https://img.shields.io/badge/AWS-EKS-FF9900?style=for-the-badge&logo=amazonaws">
  <img src="https://img.shields.io/badge/Kubernetes-v1.34-326CE5?style=for-the-badge&logo=kubernetes">
  <img src="https://img.shields.io/badge/ArgoCD-GitOps-EF7B4D?style=for-the-badge&logo=argo">
  <img src="https://img.shields.io/badge/Jenkins-CI%2FCD-D24939?style=for-the-badge&logo=jenkins">
  <img src="https://img.shields.io/badge/Prometheus-Monitoring-E6522C?style=for-the-badge&logo=prometheus">
  <img src="https://img.shields.io/badge/Grafana-Dashboards-F46800?style=for-the-badge&logo=grafana">
  <img src="https://img.shields.io/badge/Trivy-Security-1904DA?style=for-the-badge">
</p>

---

## 📌 Overview

**CapitalX** is a production-style, cloud-native investment platform built to demonstrate modern DevOps and Platform Engineering practices on AWS.

The project implements an end-to-end workflow covering:

* CI/CD automation
* GitOps deployments
* Kubernetes orchestration
* Security scanning
* Real-time monitoring
* Cloud infrastructure management
* Production deployment patterns

---

## 🏗️ Architecture

```text
GitHub
   │
   ▼
Jenkins (CI/CD)
   │
   ▼
Amazon ECR
   │
   ▼
ArgoCD (GitOps)
   │
   ▼
Amazon EKS Cluster
   │
   ├── Frontend Pods
   ├── Backend Pods
   ├── Redis
   ├── Prometheus
   └── Grafana
```

---

## ☁️ AWS Infrastructure

| Service                   | Purpose                     |
| ------------------------- | --------------------------- |
| Amazon EKS                | Managed Kubernetes Cluster  |
| Amazon ECR                | Private Container Registry  |
| Amazon RDS PostgreSQL     | Managed Database            |
| EC2                       | Jenkins CI/CD Server        |
| Application Load Balancer | Internet-facing Ingress     |
| CloudFormation            | Infrastructure Provisioning |
| IAM                       | Access Control              |
| VPC                       | Networking Architecture     |
| Security Groups           | Network Security            |

---

## ⚙️ DevOps Toolchain

| Tool       | Purpose                       |
| ---------- | ----------------------------- |
| Jenkins    | Continuous Integration        |
| ArgoCD     | GitOps Continuous Delivery    |
| Docker     | Containerization              |
| Trivy      | Security Scanning             |
| Prometheus | Metrics Collection            |
| Grafana    | Visualization & Monitoring    |
| Helm       | Kubernetes Package Management |
| kubectl    | Cluster Operations            |
| eksctl     | EKS Provisioning              |

---

## 💻 Technology Stack

### Frontend

* Next.js 14
* TypeScript
* Tailwind CSS

### Backend

* NestJS
* Prisma ORM
* JWT Authentication
* Swagger API Documentation

### Database

* PostgreSQL (Amazon RDS)
* Redis

### Infrastructure

* Docker
* Kubernetes
* Amazon EKS
* Jenkins
* ArgoCD

---

## 🚀 CI/CD & GitOps Workflow

```text
Developer
   │
   ▼
GitHub Repository
   │
   ▼
Jenkins Pipeline
   │
   ├── Build Docker Images
   ├── Trivy Security Scan
   ├── Push to Amazon ECR
   └── Email Notifications
           │
           ▼
ArgoCD Auto Sync
           │
           ▼
Amazon EKS Deployment
```

---

## ✨ Production Features

* ✅ Zero-Downtime Rolling Deployments
* ✅ Horizontal Pod Autoscaling (HPA)
* ✅ GitOps Deployment Strategy
* ✅ Kubernetes Secrets Management
* ✅ Real-Time Monitoring
* ✅ Security Scanning with Trivy
* ✅ Automated Email Notifications
* ✅ ALB Ingress Controller
* ✅ Self-Healing Kubernetes Workloads
* ✅ Multi-Stage Docker Builds

---

## 📊 Monitoring Stack

### Prometheus

* Kubernetes Metrics Collection
* Application Metrics
* Node Monitoring
* Resource Utilization

### Grafana

* Cluster Dashboards
* CPU & Memory Monitoring
* Network Analytics
* Application Health Monitoring

---

## 🔒 Security

### Trivy Integration

The CI pipeline performs automated vulnerability scanning:

```bash
trivy fs --severity HIGH,CRITICAL .
```

Security measures implemented:

* Kubernetes Secrets
* IAM Roles & Policies
* Security Groups
* JWT Authentication
* Private ECR Repositories
* RDS Network Isolation

---

## 📂 Project Structure

```bash
CapitalX
│
├── backend/
│   ├── src/
│   ├── prisma/
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   └── Dockerfile
│
├── k8s/
│   ├── backend.yml
│   ├── frontend.yml
│   ├── ingress.yml
│   └── hpa.yml
│
├── jenkins/
│   └── Jenkinsfile-CI-eks
│
└── README.md
```

---

## 🖼️ Screenshots

### Architecture Diagram

```md
![Architecture](./assets/architecture.png)
```

### Jenkins Pipeline

```md
![Jenkins](./assets/jenkins.png)
```

### ArgoCD Dashboard

```md
![ArgoCD](./assets/argocd.png)
```

### Grafana Monitoring

```md
![Grafana](./assets/grafana.png)
```

### EKS Pods

```md
![Pods](./assets/pods.png)
```

---

## 🛠️ Local Development

### Clone Repository

```bash
git clone https://github.com/aaftabparmar-DevOps-Eng/CapitalX.git

cd CapitalX
```

### Frontend

```bash
cd frontend

npm install

npm run dev
```

### Backend

```bash
cd backend

npm install

npm run start:dev
```

---

## ☸️ Kubernetes Deployment

### Apply Kubernetes Resources

```bash
kubectl apply -f k8s/
```

### Verify Pods

```bash
kubectl get pods -n capitalx
```

### Verify Services

```bash
kubectl get svc -n capitalx
```

### Verify Ingress

```bash
kubectl get ingress -n capitalx
```

---

## 📚 Key Learnings

This project helped me gain practical experience in:

* Production Kubernetes Deployments
* GitOps with ArgoCD
* AWS Cloud Infrastructure
* CI/CD Automation
* Container Security
* Observability Engineering
* Infrastructure as Code
* Kubernetes Networking
* Secrets Management
* Cloud-Native Application Deployment

---

## 👨‍💻 Author

### Aaftab Parmar

DevOps & Cloud Engineer

🔗 GitHub:

https://github.com/aaftabparmar-DevOps-Eng

---

## ⭐ Support

If you found this project useful, please consider giving it a star.

```bash
⭐ Star this repository
🍴 Fork this project
🚀 Build something amazing
```
