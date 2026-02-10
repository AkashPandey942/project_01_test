# Aptech Product Dashboard

## Project Overview
This is a Product Management Dashboard built with React, TypeScript, Tailwind CSS, and ShadCN UI.
It features authentication, a responsive layout, dashboard statistics, and product management capabilities.

## Tech Stack
- **Framework:** React 18 + Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS + ShadCN UI
- **State Management:** Zustand (Auth), TanStack Query (Server State)
- **Form Handling:** React Hook Form + Zod
- **Charts:** Recharts
- **Icons:** Lucide React
- **HTTP Client:** Axios

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1.  Open this folder in your terminal:
    ```bash
    cd "C:\Users\Akash Pandey\.gemini\antigravity\scratch\aptech-product-dashboard"
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Run the development server:
    ```bash
    npm run dev
    ```

4.  Open your browser at `http://localhost:5173`.

### Login Credentials
To test the authentication flow, use the following credentials (provided by DummyJSON):

- **Username:** `emilys`
- **Password:** `emilyspass`

## Features Implemented
- **Authentication:** Login flow with JWT handling and automatic token refresh interceptors.
- **Layout:** Responsive sidebar navigation and header with theme support structure.
- **Dashboard:** Real-time statistics fetched from DummyJSON API, visualized with Recharts.
- **Architecture:** Clean folder structure separating components, hooks, services, and stores.

## Next Steps
- Implement full Product CRUD operations in the Products page.
- Add Image Upload via Cloudinary.
- Implement User management view.
