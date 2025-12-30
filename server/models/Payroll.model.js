import mongoose from "mongoose";

const payrollSchema = new mongoose.Schema(
  {
    employee_id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    department: { type: String, required: true },
    salary: { type: Number, min: 0, required: true },
    bonus: { type: Number, min: 0, default: 0 },
    deductions: { type: Number, min: 0, default: 0 },
    taxPercent: { type: Number, min: 0, max: 100, default: 10 },
    socialSecurityPercent: { type: Number, min: 0, max: 100, default: 5 },
    paid: {
      type: Boolean,
      default: false,
    },
    paidAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Payroll = mongoose.model("Payroll", payrollSchema);

export default Payroll;
