# LedgerFlow - Full-Stack Personal Finance Tracker

LedgerFlow is a robust, production-grade web application designed to help users take complete control of their financial wellness. The platform features secure authentication, interactive real-time data tracking pipelines, dynamic budget guardrails, and automated report generation.

## 🚀 Live Production Links
* **Frontend UI (Vercel):** [https://expense-tracker-ten-beige-98.vercel.app/](https://expense-tracker-ten-beige-98.vercel.app/)
* **Backend API (Render):** [https://ledgerflow-backend-nobr.onrender.com/](https://ledgerflow-backend-nobr.onrender.com/)

---

## 🛠️ Tech Stack & Architecture

LedgerFlow is built using an integrated, decoupled full-stack architecture:

* **Frontend:** React, Vite, Tailwind CSS, Lucide Icons, Axios Client
* **Backend:** Django, Django REST Framework (DRF), SimpleJWT (Token-based state management engine)
* **Database:** PostgreSQL (Production cloud cluster managed via Render) / SQLite (Local testing configuration fallback)
* **Deployment & DevOps:** Continuous Integration (CI) linked across GitHub, Vercel (Frontend Hosting Edge Network), and Render (Backend Container Infrastructure Layer with WhiteNoise static resource streaming)

---

## ✨ Features

* **Full-Stack CRUD Engine:** Real-time expense logs where transactions can be cleanly created, viewed, dynamically compiled, and permanently deleted.
* **Smart Budget Thresholds:** Live budget trackers that accurately watch dynamic spending habits against predefined limits.
* **Financial Reporting Engine:** Direct backend compilation that converts local user financial metrics into instantly downloadable Excel documents (`/api/expenses/export_excel/`).
* **Advanced Multi-Zone CORS Protection:** Custom preflight options and security policy layers allowing seamless authenticated handshakes across different domains.
* **Production-Ready Cookies:** Secure JWT token transfer using cross-site `SameSite='None'` and `Secure=True` HttpOnly architectures to natively support web clients while running on isolated global servers.

---

## 💻 Repository Structure

```text
├── core/                  # Django project configuration settings
├── expenses/              # Backend application logic, models, and endpoints
├── frontend/              # React frontend client interface (Vite)
├── manage.py              # Django command-line utility
└── README.md              # Global project documentation (This file)
💻 Local Architecture Setup
Prerequisites
Python 3.x Installed

Node.js & npm Installs Active

1. Backend Service Configuration
From your project's main repository root path:

PowerShell
# Create and activate your virtual sandbox environment
python -m venv .venv
.venv\Scripts\activate

# Install requirements
pip install -r requirements.txt

# Run database migrations and start the server
python manage.py migrate
python manage.py runserver
2. Frontend Interface Configuration
From the frontend/ directory workspace:

PowerShell
cd frontend
npm install
npm run dev
The client dashboard layer will spin up automatically on http://localhost:5173/ and bridge straight to your database controllers!