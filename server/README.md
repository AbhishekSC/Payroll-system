# Payroll & Compensation Platform

## Overview

This project is a backend payroll and compensation system built as part of a technical assessment.

The goal was to design and implement core payroll functionality while demonstrating secure API design,

financial domain awareness, testing practices, and responsible use of AI-assisted development tools.

The system supports:

- Payroll CRUD operations

- Gross-to-net salary calculation

- Payroll anomaly detection

- Secure authentication and authorization

- Admin vs Employee access control

---

## Tech Stack

- Node.js

- Express.js

- MongoDB (Mongoose)

- JWT Authentication

- bcrypt for password hashing

- Jest & Supertest for testing

- Postman for manual API testing

---

## Roles & Access Control

### ADMIN

- Register users

- Create, update, delete payrolls

- View all payroll records

- View net salary calculations

- View payroll anomaly reports

### EMPLOYEE

- View only their own payroll

- View net salary breakdown for their payroll

Role-based access is enforced using JWT claims and middleware-level authorization.

---

## Setup Instructions

### 1. Clone the Repository

```bash

git clone <your-repo-url>

cd payroll-system

## Install dependencies

```bash

npm install

## Environment Variables

# Server configuration
PORT= 5001
NODE_ENV=development

# Database configuration
MONGODB_URI=

# Authentication
JWT_SECRET=
JWT_EXPIRES_IN=

## start the server

npm run dev
#or
node src/server.js
 
## API base URL
 http://localhost:5001/api

Roles & Access Control

ADMIN

	•	Register users
	•	Create, update, delete payrolls
	•	View all payrolls
	•	View net salary calculations
	•	View payroll anomaly reports

EMPLOYEE

	•	View only their own payroll
	•	View net salary breakdown for their payroll

Role-based access is enforced using JWT and authorization middleware.

Roles & Access Control

ADMIN

	•	Register users
	•	Create, update, delete payrolls
	•	View all payrolls
	•	View net salary calculations
	•	View payroll anomaly reports

EMPLOYEE

	•	View only their own payroll
	•	View net salary breakdown for their payroll

Role-based access is enforced using JWT and authorization middleware.

### SAMPLE API USAGE

``` POST /api/payroll

## Create Payroll (ADMIN)

``` 
{
 "employee_id": "EMP004",
 "name": "Aditya Sharma",
 "department": "Engineering",
 "salary": 90000,
 "bonus": 10000,
 "deductions": 4000
}
```

## Net salary calculation

```GET /api/payroll/{payrollId}/net-pay```

```
{
 "gross": 100000,
 "tax": 10000,
 "socialSecurity": 5000,
 "net": 81000
}
```

## Financial Logic
### Net salary is calculated as: 
 ```Gross Salary = Salary + Bonus
Net Salary = Gross Salary - Tax - Social Security - Deductions```

Financial safeguards include:
• No negative salary, bonus, or deductions
• Percentage limits on tax and social security
• Rounding to two decimal places
Financial safeguards include:
• No negative salary, bonus, or deductions
• Percentage limits on tax and social security
• Rounding to two decimal places

## Payroll Anomaly Detection
Anomaly detection is implemented using explainable, rule-based checks:
• Bonus greater than base salary
• Deductions exceeding 50% of salary
• Negative net salary
• Unusually low salary values
This ensures transparency and auditability.

## Testing
• APIs were first validated manually using Postman.
• Automated integration tests were added using Jest and Supertest.
• Tests cover critical paths:
• Authentication
• Payroll creation
• Role-based access control
• Net salary calculation
• Anomaly detectionTesting

## Run test using:
```npm test```

## Security Considerations
• JWT-based authentication
• Role-based authorization (Admin vs Employee)
• Password hashing using bcrypt
• Input validation for all financial fields
• Employee data isolation
• Immutable business identifiers (employee_id)

## AI Usage Summary
AI-assisted tools (e.g., ChatGPT) were used responsibly to:
• Validate payroll and net salary calculation logic
• Identify financial and security edge cases
• Review JWT authentication and authorization best practices
• Improve controller robustness and defensive programming
• Assist in structuring documentation
All AI-generated suggestions were manually reviewed and intentionally implemented.
Final architectural decisions, testing, and validation were performed by the developer.


## Assessment Alignment
This project demonstrates:
• Code quality, correctness, and completeness
• Secure and scalable backend design
• Financial domain awareness
• Responsible and transparent AI usage
• Clear documentation and testing practices