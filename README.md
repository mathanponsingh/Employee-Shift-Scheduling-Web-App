# Employee Shift Scheduling Web App

A modern, full-stack web application designed to streamline employee shift management and scheduling. This project features dedicated portals for administrators and employees, ensuring efficient workforce coordination.

## 🚀 Features

### Admin Portal
- **Dashboard**: Comprehensive overview of employees and upcoming shifts.
- **Employee Management**: Create, update, and delete employee profiles.
- **Shift Scheduling**: 
  - Add and manage shifts for employees.
  - View schedules in both **List** and **Calendar** formats.
  - Filter shifts by date (Today, Upcoming, All).
  - Search functionality for specific employees.
- **Data Export**: Export the entire shift schedule to **Excel (.xlsx)** format.
- **Authentication**: Secure admin signup and login.

### Employee Portal
- **Personal Dashboard**: Employees can view their assigned shifts.
- **Authentication**: Secure login and logout functionality.

## 🛠️ Technology Stack

- **Frontend**: React (Vite), Tailwind CSS, DaisyUI, Lucide React (Icons).
- **Backend**: Node.js, Express.
- **Database**: MySQL.
- **State Management**: Zustand.
- **Persistence**: Cookies (Cookie-parser) & JSON Web Tokens (JWT).
- **Excel Generation**: ExcelJS.
- **Deployment**: Vercel.

## 🗄️ Database Schema

The application uses a MySQL database with the following table structures:

### 1. `admin`
Stores administrator credentials for the admin portal.
- `id`: INT (Primary Key, Auto Increment)
- `email`: VARCHAR (Unique)
- `password`: VARCHAR (Hashed)
- `name`: VARCHAR

### 2. `employees`
Stores employee profiles for management and login.
- `id`: INT (Primary Key, Auto Increment)
- `name`: VARCHAR
- `email`: VARCHAR (Unique)
- `password`: VARCHAR (Hashed)
- `role`: VARCHAR

### 3. `shifts`
Stores scheduling data linking employees to specific dates and times.
- `id`: INT (Primary Key, Auto Increment)
- `employee_id`: INT (Foreign Key referencing `employees.id`)
- `shift_date`: DATE
- `start_time`: TIME
- `end_time`: TIME

## 📂 Project Structure

```text
Employee-Shift-Scheduling-Web-App/
├── admin/          # React + Vite Admin Frontend
├── employee/       # React + Vite Employee Frontend
├── backend/        # Express.js API Backend
└── vercel.json     # Root Vercel configuration
```

## ⚙️ Getting Started

### Prerequisites
- Node.js (v18+)
- MySQL Database

### Installation

1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd Employee-Shift-Scheduling-Web-App
   ```

2. **Backend Setup**:
   ```bash
   cd backend
   npm install
   # Create a .env file based on the environment variables provided
   npm run dev
   ```

3. **Admin Frontend Setup**:
   ```bash
   cd ../admin
   npm install
   npm run dev
   ```

4. **Employee Frontend Setup**:
   ```bash
   cd ../employee
   npm install
   npm run dev
   ```

## 🌐 Deployment

The project is configured for deployment on **Vercel**.

## 🌐 Links
employee: https://employee-shift-scheduling-web-app.vercel.app/
admin: https://employee-shift-scheduling-web-app-admin.vercel.app/

