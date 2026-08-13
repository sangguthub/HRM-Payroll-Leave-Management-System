# Setup & Installation Guide

## Prerequisites
- **Java 17+ JDK**
- **Node.js 18+** & **npm 9+**
- **Apache Maven 3.8+**
- Optional: MySQL 8.0+ or PostgreSQL 14+ (Defaults to embedded H2 zero-dependency database)

---

## 1. Backend Setup

### Navigate to backend:
```bash
cd backend
```

### Build & Run Tests:
```bash
mvn clean test
```

### Run Spring Boot Application:
```bash
mvn spring-boot:run
```
The backend server will start at `http://localhost:8080`.

- **Swagger API Docs**: `http://localhost:8080/swagger-ui.html`
- **H2 Database Console**: `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:hrmdb`, Username: `sa`, Password: blank)

---

## 2. Frontend Setup

### Navigate to frontend:
```bash
cd frontend
```

### Install dependencies:
```bash
npm install
```

### Run Development Server:
```bash
npm run dev
```
The React frontend will be available at `http://localhost:5173`.

---

## 3. Demo Login Credentials

| Role | Email | Password |
| --- | --- | --- |
| **System Admin** | `admin@hrm.com` | `Admin@123` |
| **HR Manager** | `hr@hrm.com` | `Hr@123` |
| **Employee** | `employee@hrm.com` | `Employee@123` |
