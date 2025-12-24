import Payroll from "../models/Payroll.model.js";
import { calculateNetSalary } from "../utils/salaryCalculator.js";

export const createPayroll = async (data) => {
  const payroll = await Payroll.create(data);
  return enrich(payroll);
};
export const getPayrollById = async (id) => {
  const payroll = await Payroll.findById(id);
  if (!payroll) throw new Error("Payroll not found");
  return enrich(payroll);
};
const enrich = (p) => ({
  ...p.toObject(),
  breakdown: calculateNetSalary(p),
});
