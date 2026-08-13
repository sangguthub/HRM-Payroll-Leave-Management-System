# REST API Documentation

Base URL: `http://localhost:8080/api`

## Authentication APIs

### 1. User Login
- **Endpoint**: `POST /api/auth/login`
- **Request Body**:
```json
{
  "email": "hr@hrm.com",
  "password": "Hr@123"
}
```
- **Response**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "userId": 2,
  "employeeId": null,
  "name": "HR Manager",
  "email": "hr@hrm.com",
  "role": "ROLE_HR"
}
```

---

## Employee Management APIs

### 2. Create Employee
- **Endpoint**: `POST /api/employees`
- **Headers**: `Authorization: Bearer <JWT_TOKEN>`
- **Request Body**:
```json
{
  "employeeCode": "EMP006",
  "firstName": "Suresh",
  "lastName": "Raina",
  "email": "suresh.raina@hrm.com",
  "phone": "9876543299",
  "dateOfJoining": "2026-02-01",
  "departmentId": 1,
  "designation": "Backend Engineer",
  "password": "Employee@123"
}
```

### 3. Get All Employees
- **Endpoint**: `GET /api/employees`
- **Headers**: `Authorization: Bearer <JWT_TOKEN>`

---

## Salary Structure APIs

### 4. Create Salary Structure
- **Endpoint**: `POST /api/salary-structures`
- **Request Body**:
```json
{
  "name": "Senior Lead Structure",
  "description": "Band 4 Tech Lead",
  "basicSalary": 35000,
  "hra": 14000,
  "specialAllowance": 11000,
  "pf": 4200,
  "esi": 0,
  "professionalTax": 200
}
```

### 5. Assign Salary Structure
- **Endpoint**: `POST /api/salary-structures/assign`
- **Request Body**:
```json
{
  "employeeId": 1,
  "salaryStructureId": 1,
  "effectiveFrom": "2026-07-01"
}
```

---

## Payroll & Payslip APIs

### 6. Process Monthly Payroll
- **Endpoint**: `POST /api/payroll/process`
- **Request Body**:
```json
{
  "month": 8,
  "year": 2026
}
```

### 7. Export Payroll Excel
- **Endpoint**: `GET /api/payroll/export/excel?month=8&year=2026`
- **Response**: File download `Monthly_Payroll_8_2026.xlsx`

### 8. Download Payslip PDF
- **Endpoint**: `GET /api/payslips/{id}/download`
- **Response**: Content-Type: `application/pdf`
