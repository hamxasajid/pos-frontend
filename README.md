# ⭐ POS Frontend – React + Tailwind + Redux Toolkit

A modern, clean, and production-ready Point of Sale (POS) frontend built with React, Vite, Tailwind CSS, and Redux Toolkit. Designed with a professional UI/UX flow optimized for businesses, retailers, marts, restaurants, and SaaS POS applications.

This project follows a DRY, modular, scalable architecture and includes a role-based interface for Admin and Cashier panels.

## 🚀 Tech Stack

| Technology | Purpose |
|------------|---------|
| React (Vite) | Fast, modern frontend framework with HMR |
| Tailwind CSS | Utility-first, responsive UI styling |
| Redux Toolkit (RTK) | Scalable and predictable state management |
| React Router DOM | Role-based routing |
| Lucide Icons | Modern SVG icon library |
| Dark/Light Theme System | Theme toggler with localStorage persistence |

## 🎯 Key Features

### 🔐 Authentication & Role-Based UI
- Secure login UI
- Admin-only routes
- Cashier-only POS interface
- Automatic redirection based on user role

### 🛒 POS Billing Screen (Cashier Dashboard)
- Product search + quick add to cart
- Increment / decrement quantity
- Apply discount (percentage or flat)
- Auto tax calculation
- Subtotal & Grand Total display
- Checkout modal with payment methods
- Printable receipt preview (thermal style)

### 🧰 Admin Panel
- Dashboard with sales insights
- Product management UI (Add, Edit, Delete)
- Category management
- User management (Add Cashiers, update roles)
- Sales reports (Daily / Monthly)
- Reusable table components & filters

### 🎨 UI & Components
- Fully responsive layout
- Clean sidebar + top navbar
- Theme toggler (Light/Dark)
- Reusable modals, tables, buttons, inputs
- Toast notifications

## 📁 Folder Structure
pos-frontend/
│── public/
│── src/
│ ├── components/
│ ├── pages/
│ ├── layouts/
│ ├── redux/
│ ├── utils/
│ ├── hooks/
│ ├── App.jsx
│ ├── main.jsx
│── .env # environment variables (ignored in git)
│── package.json
│── vite.config.js
│── tailwind.config.js
│── README.md

text

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository
```bash
git clone https://github.com/your-username/pos-frontend.git
2️⃣ Install dependencies
bash
npm install
3️⃣ Start the development server
bash
npm run dev
4️⃣ Build for production
bash
npm run build
🔧 Environment Variables
Create a .env file:

env
VITE_API_URL=http://localhost:5000/api
The .env file is already added to .gitignore for security.

🧩 Scripts
Command	Description
npm run dev	Runs Vite development server
npm run build	Builds production bundle
npm run preview	Preview production build locally
npm run lint	Run ESLint
📦 Dependencies
Major libraries used:

react

react-router-dom

@reduxjs/toolkit

react-redux

tailwindcss

lucide-react

react-hot-toast

classnames

Dev dependencies include:

vite

eslint

@vitejs/plugin-react

🛡️ Code Quality & Architecture
This POS UI follows:

DRY principles

Reusable UI components

Clean Redux slices

Clear separation of modules

Consistent design system

Strict folder structure

The frontend is fully ready to connect with a backend (Node.js/Express/MongoDB recommended).

🌙 Theme System
The theme toggler supports:

Light mode

Dark mode

Stored in localStorage:

javascript
theme = "light" | "dark"
Automatically applied on reload.

🔥 Why This POS Frontend Is Sale-Ready
✔ Modular for expansion
✔ Clean UI for real business use
✔ Admin & Cashier flows separated
✔ Optimized for future SaaS subscription-based POS
✔ Plug-and-play architecture for any backend

This can be sold to:

Grocery stores

Marts

Mini stores

Restaurants

Pharmacy shops

Boutiques

🤝 Contributing
Pull requests are welcome. For major changes, open an issue to discuss your idea.

📄 License
This project is licensed under the MIT License.