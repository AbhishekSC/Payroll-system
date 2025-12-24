import Payroll from "../models/Payroll.model.js";
import { calculateNetSalary } from "../utils/salaryCalculator.js";
import { detectAnomalies } from "../utils/anomaly.js";
import mongoose from "mongoose";
import { StatusCodes, ReasonPhrases } from "http-status-codes";

/**
 * Common helper
 */
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

/**
 * ADMIN — Create Payroll
 */
export const createPayroll = async (req, res, next) => {
  try {
    const {
      employee_id,
      name,
      department,
      salary,
      bonus = 0,
      deductions = 0,
    } = req.body;

    // 1️⃣ Basic validation
    if (!employee_id || !name || !department || salary == null) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Missing required fields",
      });
    }

    // 2️⃣ Financial sanity checks
    if (salary < 0 || bonus < 0 || deductions < 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Negative values not allowed",
      });
    }

    // 3️⃣ Business rule
    if (deductions > salary + bonus) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Deductions cannot exceed gross salary",
      });
    }

    // 4️⃣ Duplicate employee payroll check
    const exists = await Payroll.findOne({ employee_id });
    if (exists) {
      return res.status(StatusCodes.CONFLICT).json({
        message: "Payroll already exists for this employee",
      });
    }

    const payroll = await Payroll.create(req.body);
    return res.status(StatusCodes.CREATED).json(payroll);
  } catch (err) {
    return next(err);
  }
};

/**
 * ADMIN — List Payrolls
 */
export const listPayrolls = async (req, res, next) => {
  try {
    const payrolls = await Payroll.find().lean();
    return res.status(StatusCodes.OK).json(payrolls);
  } catch (err) {
    return next(err);
  }
};

/**
 * ADMIN — Get Payroll by ID
 */
export const getPayrollById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Invalid payroll id",
      });
    }

    const payroll = await Payroll.findById(id).lean();
    if (!payroll) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Payroll not found",
      });
    }

    return res.status(StatusCodes.OK).json(payroll);
  } catch (err) {
    return next(err);
  }
};

/**
 * ADMIN — Update Payroll
 */
export const updatePayroll = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Invalid payroll id",
      });
    }

    // Prevent changing employee_id (immutable business key)
    if (req.body.employee_id) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "employee_id cannot be modified",
      });
    }

    // Validate financial fields if present
    const { salary, bonus, deductions } = req.body;
    if ([salary, bonus, deductions].some((v) => v !== undefined && v < 0)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Financial values cannot be negative",
      });
    }

    const payroll = await Payroll.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!payroll) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Payroll not found",
      });
    }

    return res.status(StatusCodes.OK).json(payroll);
  } catch (err) {
    return next(err);
  }
};

/**
 * ADMIN — Delete Payroll
 */
export const deletePayroll = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Invalid payroll id",
      });
    }

    const deleted = await Payroll.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Payroll not found",
      });
    }

    return res.status(StatusCodes.OK).json({
      message: "Payroll deleted successfully",
    });
  } catch (err) {
    return next(err);
  }
};

/**
 * EMPLOYEE — Get Own Payroll
 */
export const getMyPayroll = async (req, res, next) => {
  try {
    if (!req.user?.employeeId) {
      return res.status(StatusCodes.FORBIDDEN).json({
        message: "Employee ID missing in token",
      });
    }

    const payroll = await Payroll.findOne({
      employee_id: req.user.employeeId,
    });

    if (!payroll) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Payroll not found",
      });
    }

    return res.status(StatusCodes.OK).json({
      ...payroll.toObject(),
      breakdown: calculateNetSalary(payroll),
    });
  } catch (err) {
    return next(err);
  }
};

/**
 * ADMIN — Net Pay Calculation
 */
export const getNetPay = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Invalid payroll id",
      });
    }

    const payroll = await Payroll.findById(id);
    if (!payroll) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Payroll not found",
      });
    }

    return res.status(StatusCodes.OK).json(calculateNetSalary(payroll));
  } catch (err) {
    return next(err);
  }
};

/**
 * ADMIN — Anomaly Detection
 */
export const getAnomalies = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Invalid payroll id",
      });
    }

    const payroll = await Payroll.findById(id);
    if (!payroll) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Payroll not found",
      });
    }

    return res.status(StatusCodes.OK).json({
      employee_id: payroll.employee_id,
      issues: detectAnomalies(payroll),
    });
  } catch (err) {
    return next(err);
  }
};
