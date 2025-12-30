import { calculateNetSalary } from "./salaryCalculator.js";

export const detectAnomalies = (p) => {
  if (!p) 
    return [];
  const issues = [];

  const { net } = calculateNetSalary(p);
  if (p.deductions > p.salary * 0.5)
    issues.push("Deductions exceed 50% of salary");
  if (p.bonus > p.salary) 
    issues.push("Bonus greater than salary");
  if (net < 0) 
    issues.push("Negative net pay");
  if (p.salary < 15000) 
    issues.push("Unusually low salary");
  return issues;
};
