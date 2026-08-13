# HRM Payroll & Leave Management System
### Main Module: Salary Structure & Payslip Automation

An enterprise-grade, production-style **Java Full Stack Application** built with **Java 17, Spring Boot 3.2, Spring Security with JWT, Spring Data JPA, OpenPDF, Apache POI, React, Vite, and Tailwind CSS**.

---

## 🌟 Key Features

- **Role-Based Access Control (RBAC)**: Secure access tailored for `ROLE_ADMIN`, `ROLE_HR`, and `ROLE_EMPLOYEE`.
- **JWT Authentication**: Password hashing using BCrypt, JWT generation, validation, stateless security filter chain.
- **Employee Management**: Unique code validation, department mapping, auto-initialization of annual leave balances.
- **Leave Policy & Balance Management**:
  - Configurable policies (Casual Leave: 12, Sick Leave: 12, Earned Leave: 15).
  - Transactional approval & balance deduction logic (`remaining = allocated - used`).
  - Negative balance prevention & invalid date range guards.
- **Configurable Salary Structures**:
  - Earnings: Basic, HRA, Special Allowance.
  - Deductions: PF, ESI, Professional Tax.
  - Financial precision with `BigDecimal`.
  - Salary history preservation with effective date ranges.
- **Monthly Payroll Engine**:
  - Idempotent batch processing (`UNIQUE(employee_id, pay_period_month, pay_period_year)`).
  - Working days, paid days, and approved leave integration.
- **Automated OpenPDF Payslip Generation**:
  - Creates formatted PDF payslips with financial summaries, company branding, and leave statistics.
- **Automated Email & Delivery Logs**:
  - Sends payslip PDFs as email attachments via Spring Boot Mail.
  - Records delivery logs (`SENT` / `FAILED`) with manual 1-click retry & `@Scheduled` cron background retry.
- **Bonus Export Features**:
  - Monthly Payroll Excel Export (`.xlsx`) using Apache POI.
  - Monthly Bulk Payslips ZIP Download (`.zip`).
- **Interactive Dashboards**:
  - **HR Dashboard**: Financial metrics, employee statistics, email audit logs, and leave usage.
  - **Employee Dashboard**: Profile, leave balances, leave application form, and month-by-month PDF payslip downloads.

---

## 📁 Repository Structure

```text
hrm-payroll-system/
├── backend/
│   ├── pom.xml
│   └── src/
│       ├── main/java/com/example/hrm/
│       │   ├── config/          # Security, DataInitializer
│       │   ├── controller/      # REST Endpoints
│       │   ├── dto/             # Request / Response DTOs
│       │   ├── entity/          # JPA Entities
│       │   ├── enums/           # Role, Status, Leave Enums
│       │   ├── exception/       # Global Exception Handler
│       │   ├── repository/     # Spring Data JPA Repositories
│       │   ├── scheduler/      # @Scheduled Cron Jobs
│       │   ├── security/       # JWT Filters & Config
│       │   └── service/        # Business Logic & Implementations
│       └── test/java/com/example/hrm/ # JUnit 5 & Mockito Unit Tests
├── frontend/
│   ├── package.json
│   └── src/
│       ├── components/          # Dashboard, Employees, Salary, Leaves, Payslips, EmployeeView
│       ├── context/             # AuthContext
│       └── services/            # Axios API Services
├── database/
│   ├── schema.sql               # Relational Database Schema DDL
│   └── sample-data.sql          # Seed Data DML
├── postman/
│   └── HRM-Payroll.postman_collection.json # Postman Test Suite
├── docs/
│   ├── setup.md                 # Setup & Execution Guide
│   ├── api-documentation.md     # OpenAPI / REST Endpoints Reference
│   └── payroll-flow.md          # Payroll Architecture Diagram
└── README.md
```

---

## 🔑 Demo Login Credentials

| Role | Email | Password | Access Rights |
| --- | --- | --- | --- |
| **System Admin** | `admin@hrm.com` | `Admin@123` | Full system control & user management |
| **HR Manager** | `hr@hrm.com` | `Hr@123` | Employees, Salary, Leaves, Payroll, Email Logs |
| **Employee** | `employee@hrm.com` | `Employee@123` | Personal profile, Apply leave, Download own PDF payslips |

---

## 🚀 Quick Start Instructions

### 1. Run Backend (Spring Boot):
```bash
cd backend
mvn spring-boot:run
```
- Backend REST APIs: `http://localhost:8080`
- Swagger OpenAPI Specs: `http://localhost:8080/swagger-ui.html`
- H2 Console: `http://localhost:8080/h2-console`

### 2. Run Frontend (React + Vite):
```bash
cd frontend
npm install
npm run dev
```
- Frontend UI Dashboard: `http://localhost:5173`

---

## 🧪 Unit Testing

To execute all JUnit 5 & Mockito unit tests:
```bash
cd backend
mvn clean test
```
Tests verify:
- Financial `BigDecimal` Gross, Deductions, Net calculation accuracy.
- Leave date validation and balance deduction on approval.
- Payroll idempotency and duplicate execution prevention.
