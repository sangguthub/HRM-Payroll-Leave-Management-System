-- HRM Payroll & Leave Management System Schema
-- Compatible with PostgreSQL, MySQL, and H2

CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS departments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    code VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS employees (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    employee_code VARCHAR(100) NOT NULL UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(50),
    date_of_joining DATE NOT NULL,
    department_id BIGINT NOT NULL,
    designation VARCHAR(150) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    user_id BIGINT UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_employee_department FOREIGN KEY (department_id) REFERENCES departments(id),
    CONSTRAINT fk_employee_user FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS leave_policies (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    leave_type VARCHAR(50) NOT NULL UNIQUE,
    annual_allocation INT NOT NULL,
    description VARCHAR(255),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS employee_leave_balances (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    employee_id BIGINT NOT NULL,
    leave_type VARCHAR(50) NOT NULL,
    year INT NOT NULL,
    allocated INT NOT NULL,
    used INT NOT NULL DEFAULT 0,
    remaining INT NOT NULL,
    CONSTRAINT uq_emp_leave_year UNIQUE (employee_id, leave_type, year),
    CONSTRAINT fk_balance_employee FOREIGN KEY (employee_id) REFERENCES employees(id)
);

CREATE TABLE IF NOT EXISTS leave_applications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    employee_id BIGINT NOT NULL,
    leave_type VARCHAR(50) NOT NULL,
    from_date DATE NOT NULL,
    to_date DATE NOT NULL,
    number_of_days INT NOT NULL,
    reason VARCHAR(1000) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approved_at TIMESTAMP,
    approved_by BIGINT,
    rejection_reason VARCHAR(1000),
    CONSTRAINT fk_leave_employee FOREIGN KEY (employee_id) REFERENCES employees(id),
    CONSTRAINT fk_leave_approver FOREIGN KEY (approved_by) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS salary_structures (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description VARCHAR(500),
    basic_salary DECIMAL(12,2) NOT NULL,
    hra DECIMAL(12,2) NOT NULL,
    special_allowance DECIMAL(12,2) NOT NULL,
    gross_salary DECIMAL(12,2) NOT NULL,
    pf DECIMAL(12,2) NOT NULL,
    esi DECIMAL(12,2) NOT NULL,
    professional_tax DECIMAL(12,2) NOT NULL,
    net_salary DECIMAL(12,2) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS employee_salaries (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    employee_id BIGINT NOT NULL,
    salary_structure_id BIGINT NOT NULL,
    effective_from DATE NOT NULL,
    effective_to DATE,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_emp_salary_employee FOREIGN KEY (employee_id) REFERENCES employees(id),
    CONSTRAINT fk_emp_salary_structure FOREIGN KEY (salary_structure_id) REFERENCES salary_structures(id)
);

CREATE TABLE IF NOT EXISTS payroll (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    employee_id BIGINT NOT NULL,
    pay_period_month INT NOT NULL,
    pay_period_year INT NOT NULL,
    salary_structure_id BIGINT NOT NULL,
    basic_salary DECIMAL(12,2) NOT NULL,
    hra DECIMAL(12,2) NOT NULL,
    special_allowance DECIMAL(12,2) NOT NULL,
    gross_salary DECIMAL(12,2) NOT NULL,
    pf DECIMAL(12,2) NOT NULL,
    esi DECIMAL(12,2) NOT NULL,
    professional_tax DECIMAL(12,2) NOT NULL,
    total_deductions DECIMAL(12,2) NOT NULL,
    net_salary DECIMAL(12,2) NOT NULL,
    working_days INT NOT NULL,
    paid_days INT NOT NULL,
    leave_days INT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PROCESSED',
    processed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_by BIGINT,
    CONSTRAINT uq_payroll_emp_period UNIQUE (employee_id, pay_period_month, pay_period_year),
    CONSTRAINT fk_payroll_employee FOREIGN KEY (employee_id) REFERENCES employees(id),
    CONSTRAINT fk_payroll_structure FOREIGN KEY (salary_structure_id) REFERENCES salary_structures(id)
);

CREATE TABLE IF NOT EXISTS payslips (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    payroll_id BIGINT NOT NULL UNIQUE,
    employee_id BIGINT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_payslip_payroll FOREIGN KEY (payroll_id) REFERENCES payroll(id),
    CONSTRAINT fk_payslip_employee FOREIGN KEY (employee_id) REFERENCES employees(id)
);

CREATE TABLE IF NOT EXISTS email_delivery_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    employee_id BIGINT NOT NULL,
    payslip_id BIGINT NOT NULL,
    recipient_email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    sent_at TIMESTAMP,
    failure_reason VARCHAR(1000),
    retry_count INT NOT NULL DEFAULT 0,
    CONSTRAINT fk_email_employee FOREIGN KEY (employee_id) REFERENCES employees(id),
    CONSTRAINT fk_email_payslip FOREIGN KEY (payslip_id) REFERENCES payslips(id)
);

CREATE INDEX idx_employee_code ON employees(employee_code);
CREATE INDEX idx_employee_email ON employees(email);
CREATE INDEX idx_payroll_period ON payroll(pay_period_month, pay_period_year);
