-- Sample Data Seed SQL for HRM Payroll System

-- Password for all accounts is BCrypt hashed ("Admin@123", "Hr@123", "Employee@123")
INSERT INTO users (id, email, password, name, role, active) VALUES
(1, 'admin@hrm.com', '$2a$10$wNqfC75k5qZ/uU6W92dEBeN3Rz7n7wzQ8b2z.4OaL0i9m3D1vYV4O', 'System Administrator', 'ROLE_ADMIN', TRUE),
(2, 'hr@hrm.com', '$2a$10$wNqfC75k5qZ/uU6W92dEBeN3Rz7n7wzQ8b2z.4OaL0i9m3D1vYV4O', 'HR Manager', 'ROLE_HR', TRUE),
(3, 'employee@hrm.com', '$2a$10$wNqfC75k5qZ/uU6W92dEBeN3Rz7n7wzQ8b2z.4OaL0i9m3D1vYV4O', 'Rahul Sharma', 'ROLE_EMPLOYEE', TRUE),
(4, 'priya.kumar@hrm.com', '$2a$10$wNqfC75k5qZ/uU6W92dEBeN3Rz7n7wzQ8b2z.4OaL0i9m3D1vYV4O', 'Priya Kumar', 'ROLE_EMPLOYEE', TRUE),
(5, 'arjun.rao@hrm.com', '$2a$10$wNqfC75k5qZ/uU6W92dEBeN3Rz7n7wzQ8b2z.4OaL0i9m3D1vYV4O', 'Arjun Rao', 'ROLE_EMPLOYEE', TRUE);

INSERT INTO departments (id, name, code, description) VALUES
(1, 'Engineering', 'ENG', 'Software Engineering & IT'),
(2, 'Human Resources', 'HR', 'HR & Talent Ops'),
(3, 'Finance', 'FIN', 'Finance & Payroll Operations');

INSERT INTO leave_policies (id, leave_type, annual_allocation, description, active) VALUES
(1, 'CL', 12, 'Casual Leave', TRUE),
(2, 'SL', 12, 'Sick Leave', TRUE),
(3, 'EL', 15, 'Earned Leave', TRUE);

INSERT INTO salary_structures (id, name, description, basic_salary, hra, special_allowance, gross_salary, pf, esi, professional_tax, net_salary, active) VALUES
(1, 'Senior Tech Band', 'Senior Engineer Salary Structure', 25000.00, 10000.00, 10000.00, 45000.00, 3000.00, 0.00, 200.00, 41800.00, TRUE),
(2, 'Standard Mid Band', 'Standard Developer / HR Salary Structure', 20000.00, 8000.00, 7000.00, 35000.00, 2400.00, 0.00, 200.00, 32400.00, TRUE),
(3, 'Junior Entry Band', 'Junior Associate Salary Structure', 15000.00, 6000.00, 5000.00, 26000.00, 1800.00, 500.00, 200.00, 23500.00, TRUE);

INSERT INTO employees (id, employee_code, first_name, last_name, email, phone, date_of_joining, department_id, designation, status, user_id) VALUES
(1, 'EMP001', 'Rahul', 'Sharma', 'employee@hrm.com', '9876543210', '2023-01-15', 1, 'Java Full Stack Developer', 'ACTIVE', 3),
(2, 'EMP002', 'Priya', 'Kumar', 'priya.kumar@hrm.com', '9876543211', '2023-03-01', 2, 'HR Executive', 'ACTIVE', 4),
(3, 'EMP003', 'Arjun', 'Rao', 'arjun.rao@hrm.com', '9876543212', '2023-05-10', 1, 'Senior Software Engineer', 'ACTIVE', 5);

INSERT INTO employee_salaries (id, employee_id, salary_structure_id, effective_from, active) VALUES
(1, 1, 2, '2026-01-01', TRUE),
(2, 2, 2, '2026-01-01', TRUE),
(3, 3, 1, '2026-01-01', TRUE);

INSERT INTO employee_leave_balances (id, employee_id, leave_type, year, allocated, used, remaining) VALUES
(1, 1, 'CL', 2026, 12, 2, 10),
(2, 1, 'SL', 2026, 12, 1, 11),
(3, 1, 'EL', 2026, 15, 3, 12),
(4, 2, 'CL', 2026, 12, 1, 11),
(5, 2, 'SL', 2026, 12, 1, 11),
(6, 2, 'EL', 2026, 15, 1, 14),
(7, 3, 'CL', 2026, 12, 0, 12),
(8, 3, 'SL', 2026, 12, 0, 12),
(9, 3, 'EL', 2026, 15, 0, 15);
