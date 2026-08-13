# End-to-End Payroll Flow Architecture

```text
HR Login
   ↓
HR Dashboard
   ↓
Create Employee (Initializes CL: 12, SL: 12, EL: 15)
   ↓
Configure Salary Structure (Calculates Gross, Deductions, Net)
   ↓
Assign Salary Structure to Employee (Preserves History)
   ↓
Employee Login -> Applies for Leave
   ↓
HR Approves Leave -> Balance Deducted
   ↓
HR Selects Month & Year -> Clicks "Process Monthly Payroll"
   ↓
System Checks Idempotency (Prevents Duplicate Payroll)
   ↓
Fetches Effective Salary & Approved Leave Days
   ↓
Calculates Earnings, Deductions, Working & Paid Days
   ↓
Creates Payroll Record in DB
   ↓
Generates PDF Payslip via OpenPDF
   ↓
Sends Email with PDF Attachment via Spring Mail
   ↓
Records Email Delivery Log (Sent / Failed)
   ↓
Employee Logs In -> Downloads Official PDF Payslip
```
