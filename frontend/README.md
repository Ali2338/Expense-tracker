# LedgerFlow - Frontend Client Interface

This directory houses the user interface for LedgerFlow, a modern, responsive personal finance tracking dashboard. Built using React and Vite, this application focuses on high-performance rendering, dynamic data visualization, and secure session management.

## 🚀 Key Client Features

* **Vite-Powered HMR:** Lightning-fast Hot Module Replacement during development for rapid UI tuning.
* **Component-Driven UI:** Modular architecture built using clean React functional components.
* **Modern Interface Elements:** Dynamic dashboard design stylized with **Tailwind CSS** and crisp interface icons from **Lucide React**.
* **Global Routing Gate:** Dynamic client-side routing pipeline (`App.jsx`) that smoothly transitions between Register, Login, and Dashboard layouts based on backend verification responses.
* **Secure Session Handshakes:** Custom Axios instance config configured with `withCredentials: true` to handle secure cross-origin HTTP-Only token storage securely.

---

## 🛠️ Local Tech Stack

* **Core Engine:** React 18+ / Vite
* **Styling Framework:** Tailwind CSS
* **Iconography:** Lucide React
* **API Client:** Axios 

---

## 💻 Getting Started Locally

1. Ensure you have Node.js installed on your system.
2. Open your terminal and navigate to this folder:
   ```powershell
   cd frontend
3. Install all optimization and asset dependencies:

   ```powershell
   npm install
4. Fire up the local Vite development web server:

   ```powershell
   npm run dev
5. Open your browser to http://localhost:5173/ to see the live system interface connected to your running Django backend!