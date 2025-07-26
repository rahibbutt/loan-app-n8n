# Loan Application Automation Workflow using n8n

This project automates the loan application process using a **Vue 3 frontend**, **Node.js backend**, **MySQL database**, **phpMyAdmin** and **n8n** for workflow automation. Everything is fully dockerized for easy setup and deployment.

## Features
- **Frontend:** Vue 3 application for the user interface.
- **Backend:** Node.js/Express server with SQLite/MySQL integration.
- **Database:** MySQL for persistent data storage.
- **Workflow Automation:** n8n for orchestrating automated tasks.
- **Database Management:** phpMyAdmin for MySQL administration.

## Getting Started

### Prerequisites
- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/)

### Installation
Clone this repository:

```bash
git clone git@github.com:rahibbutt/loan-app-n8n.git
cd loan-app-n8n
docker compose -f docker-compose.yml up -d
docker compose -f docker-compose.yml down (to shutdown all the containers)
```

Frontend: http://localhost:5173

Backend API: http://localhost:3000

phpMyAdmin: http://localhost:8080

n8n Automation Tool: http://localhost:5678
