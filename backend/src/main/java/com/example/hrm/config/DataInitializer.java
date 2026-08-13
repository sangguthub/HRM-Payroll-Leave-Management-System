package com.example.hrm.config;

import com.example.hrm.entity.*;
import com.example.hrm.enums.*;
import com.example.hrm.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final EmployeeRepository employeeRepository;
    private final LeavePolicyRepository leavePolicyRepository;
    private final EmployeeLeaveBalanceRepository leaveBalanceRepository;
    private final SalaryStructureRepository salaryStructureRepository;
    private final EmployeeSalaryRepository employeeSalaryRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() > 0) {
            log.info("Database already initialized. Skipping seed data creation.");
            return;
        }

        log.info("Initializing HRM seed data...");

        // 1. Users & Credentials
        User adminUser = userRepository.save(User.builder()
                .name("Admin Manager")
                .email("admin@hrm.com")
                .password(passwordEncoder.encode("Admin@123"))
                .role(Role.ROLE_ADMIN)
                .active(true)
                .build());

        User hrUser = userRepository.save(User.builder()
                .name("HR Manager")
                .email("hr@hrm.com")
                .password(passwordEncoder.encode("Hr@123"))
                .role(Role.ROLE_HR)
                .active(true)
                .build());

        User empUser1 = userRepository.save(User.builder()
                .name("Rahul Sharma")
                .email("employee@hrm.com")
                .password(passwordEncoder.encode("Employee@123"))
                .role(Role.ROLE_EMPLOYEE)
                .active(true)
                .build());

        User empUser2 = userRepository.save(User.builder()
                .name("Priya Kumar")
                .email("priya.kumar@hrm.com")
                .password(passwordEncoder.encode("Employee@123"))
                .role(Role.ROLE_EMPLOYEE)
                .active(true)
                .build());

        User empUser3 = userRepository.save(User.builder()
                .name("Arjun Rao")
                .email("arjun.rao@hrm.com")
                .password(passwordEncoder.encode("Employee@123"))
                .role(Role.ROLE_EMPLOYEE)
                .active(true)
                .build());

        User empUser4 = userRepository.save(User.builder()
                .name("Sneha Patil")
                .email("sneha.patil@hrm.com")
                .password(passwordEncoder.encode("Employee@123"))
                .role(Role.ROLE_EMPLOYEE)
                .active(true)
                .build());

        User empUser5 = userRepository.save(User.builder()
                .name("Kiran Kumar")
                .email("kiran.kumar@hrm.com")
                .password(passwordEncoder.encode("Employee@123"))
                .role(Role.ROLE_EMPLOYEE)
                .active(true)
                .build());

        // 2. Departments
        Department eng = departmentRepository.save(Department.builder().name("Engineering").code("ENG").description("Software Engineering").build());
        Department hrDept = departmentRepository.save(Department.builder().name("Human Resources").code("HR").description("HR & People Ops").build());
        Department fin = departmentRepository.save(Department.builder().name("Finance").code("FIN").description("Finance & Accounting").build());

        // 3. Leave Policies
        leavePolicyRepository.save(LeavePolicy.builder().leaveType(LeaveType.CL).annualAllocation(12).description("Casual Leave").active(true).build());
        leavePolicyRepository.save(LeavePolicy.builder().leaveType(LeaveType.SL).annualAllocation(12).description("Sick Leave").active(true).build());
        leavePolicyRepository.save(LeavePolicy.builder().leaveType(LeaveType.EL).annualAllocation(15).description("Earned Leave").active(true).build());

        // 4. Salary Structures
        SalaryStructure struct1 = SalaryStructure.builder()
                .name("Senior Developer Structure")
                .description("Band 3 Technical")
                .basicSalary(new BigDecimal("25000.00"))
                .hra(new BigDecimal("10000.00"))
                .specialAllowance(new BigDecimal("10000.00"))
                .pf(new BigDecimal("3000.00"))
                .esi(new BigDecimal("0.00"))
                .professionalTax(new BigDecimal("200.00"))
                .active(true)
                .build();
        struct1.calculateTotals();
        struct1 = salaryStructureRepository.save(struct1);

        SalaryStructure struct2 = SalaryStructure.builder()
                .name("Standard Developer / HR Structure")
                .description("Band 2 Mid-Level")
                .basicSalary(new BigDecimal("20000.00"))
                .hra(new BigDecimal("8000.00"))
                .specialAllowance(new BigDecimal("7000.00"))
                .pf(new BigDecimal("2400.00"))
                .esi(new BigDecimal("0.00"))
                .professionalTax(new BigDecimal("200.00"))
                .active(true)
                .build();
        struct2.calculateTotals();
        struct2 = salaryStructureRepository.save(struct2);

        SalaryStructure struct3 = SalaryStructure.builder()
                .name("Junior Developer Structure")
                .description("Band 1 Entry-Level")
                .basicSalary(new BigDecimal("15000.00"))
                .hra(new BigDecimal("6000.00"))
                .specialAllowance(new BigDecimal("5000.00"))
                .pf(new BigDecimal("1800.00"))
                .esi(new BigDecimal("500.00"))
                .professionalTax(new BigDecimal("200.00"))
                .active(true)
                .build();
        struct3.calculateTotals();
        struct3 = salaryStructureRepository.save(struct3);

        // 5. Employees
        Employee e1 = employeeRepository.save(Employee.builder().employeeCode("EMP001").firstName("Rahul").lastName("Sharma").email("employee@hrm.com").phone("9876543210").dateOfJoining(LocalDate.of(2023, 1, 15)).department(eng).designation("Java Full Stack Developer").status(EmployeeStatus.ACTIVE).user(empUser1).build());
        Employee e2 = employeeRepository.save(Employee.builder().employeeCode("EMP002").firstName("Priya").lastName("Kumar").email("priya.kumar@hrm.com").phone("9876543211").dateOfJoining(LocalDate.of(2023, 3, 1)).department(hrDept).designation("HR Executive").status(EmployeeStatus.ACTIVE).user(empUser2).build());
        Employee e3 = employeeRepository.save(Employee.builder().employeeCode("EMP003").firstName("Arjun").lastName("Rao").email("arjun.rao@hrm.com").phone("9876543212").dateOfJoining(LocalDate.of(2023, 5, 10)).department(eng).designation("Senior Software Engineer").status(EmployeeStatus.ACTIVE).user(empUser3).build());
        Employee e4 = employeeRepository.save(Employee.builder().employeeCode("EMP004").firstName("Sneha").lastName("Patil").email("sneha.patil@hrm.com").phone("9876543213").dateOfJoining(LocalDate.of(2023, 8, 20)).department(fin).designation("Finance Analyst").status(EmployeeStatus.ACTIVE).user(empUser4).build());
        Employee e5 = employeeRepository.save(Employee.builder().employeeCode("EMP005").firstName("Kiran").lastName("Kumar").email("kiran.kumar@hrm.com").phone("9876543214").dateOfJoining(LocalDate.of(2024, 2, 1)).department(eng).designation("Frontend Engineer").status(EmployeeStatus.ACTIVE).user(empUser5).build());

        // 6. Assign Salaries
        assignSalary(e1, struct2, LocalDate.of(2026, 1, 1));
        assignSalary(e2, struct2, LocalDate.of(2026, 1, 1));
        assignSalary(e3, struct1, LocalDate.of(2026, 1, 1));
        assignSalary(e4, struct2, LocalDate.of(2026, 1, 1));
        assignSalary(e5, struct3, LocalDate.of(2026, 1, 1));

        // 7. Initialize Leave Balances
        int currentYear = LocalDate.now().getYear();
        Employee[] employees = {e1, e2, e3, e4, e5};
        for (Employee emp : employees) {
            leaveBalanceRepository.save(EmployeeLeaveBalance.builder().employee(emp).leaveType(LeaveType.CL).year(currentYear).allocated(12).used(2).remaining(10).build());
            leaveBalanceRepository.save(EmployeeLeaveBalance.builder().employee(emp).leaveType(LeaveType.SL).year(currentYear).allocated(12).used(1).remaining(11).build());
            leaveBalanceRepository.save(EmployeeLeaveBalance.builder().employee(emp).leaveType(LeaveType.EL).year(currentYear).allocated(15).used(3).remaining(12).build());
        }

        log.info("HRM Seed Data Initialized successfully! Demo accounts ready.");
    }

    private void assignSalary(Employee emp, SalaryStructure struct, LocalDate from) {
        employeeSalaryRepository.save(EmployeeSalary.builder()
                .employee(emp)
                .salaryStructure(struct)
                .effectiveFrom(from)
                .active(true)
                .build());
    }
}
