PocketMonie – Smart Savings App

PocketMonie is a modern savings application that helps users create, manage, and grow multiple savings plans in a simple, transparent, and secure way.
It combines a React frontend and a NestJS backend, containerized with Docker for easy setup and deployment.


Features

💰 Create and manage savings plans

🧮 Track balances and withdrawals

🔐 Secure authentication and authorization

📊 Responsive dashboard with progress tracking

☁️ Backend API built with NestJS (TypeScript)

🐳 Dockerized setup for easy local development


BankApp/
│
├── backend/               # NestJS backend service
│   ├── src/               # API source code
│   ├── dist/              # Compiled output (ignored in Git)
│   ├── package.json       # Backend dependencies
│   ├── docker-compose.yml # Optional backend Docker config
│   └── Dockerfile         # Backend Docker build file
│
├── src/                   # React frontend source
│   ├── Components/
│   ├── Pages/
│   ├── assets/
│   └── main.jsx
│
├── package.json           # Frontend dependencies
├── index.html             # Frontend entry file
├── tailwind.config.cjs    # Tailwind configuration
└── README.md


Tech Stack
Layer	Technology
Frontend	React, Vite, Tailwind CSS
Backend	NestJS, TypeScript, Node.js
Database	PostgreSQL
Containerization	Docker, Docker Compose
Version Control	Git & GitHub



Getting Started
1️⃣ Clone the repository
git clone https://github.com/<your-username>/Bankapp.git
cd Bankapp

Set up environment variables

Create a .env file in both the root and backend/ directories (if needed) and add values like:
# Example
DATABASE_URL=postgres://user:password@localhost:5432/pocketmonie
JWT_SECRET=yourchoicekey

nstall dependencies

For the frontend:
npm install

For the backend:
npm install

Run locally

Frontend:npm run dev
Backend:npm run start:dev

🐳 Run with Docker

If you have Docker and Docker Compose installed:
docker-compose up --build

This spins up the backend and database automatically.

👥 Contributors

@Codewithkenny – Developer

🪄 License

This project is licensed under the MIT License




