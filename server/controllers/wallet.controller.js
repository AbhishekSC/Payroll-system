import Wallet from "../models/Wallet.model.js";
import Transaction from "../models/Transaction.js";
import { creditWallet } from "../services/Wallet.service.js";
import { detectWalletAnomalies } from "../services/walletAnomaly.service.js";

/**

 * ADMIN / PAYROLL — Credit salary

 */

export const creditSalary = async (req, res, next) => {
  try {
    const { employee_id, amount, reference_id, idempotency_key } = req.body;

    if (!employee_id || !amount || !reference_id || !idempotency_key) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const result = await creditWallet({
      employee_id,
      amount,
      reference_id,
      idempotency_key,
    });

    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

/**

 * EMPLOYEE — View wallet

 */

export const getMyWallet = async (req, res, next) => {
  console.log("Employee ID:", req.user.employeeId); // Debugging line
  try {
    const wallet = await Wallet.findOne({
      employee_id: req.user.employeeId,
    });

    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }

    res.json(wallet);
  } catch (err) {
    next(err);
  }
};

/**

 * EMPLOYEE — Transaction history

 */

export const getMyTransactions = async (req, res, next) => {
  try {
    const wallet = await Wallet.findOne({
      employee_id: req.user.employeeId,
    });

    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }

    const txs = await Transaction.find({ wallet_id: wallet._id }).sort({
      createdAt: -1,
    });

    res.json(txs);
  } catch (err) {
    next(err);
  }
};

/**

 * ADMIN — Wallet anomaly report

 */

export const getWalletAnomalies = async (req, res, next) => {
  try {
    const wallet = await Wallet.findOne({
      employee_id: req.params.employeeId,
    });

    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }

    const issues = await detectWalletAnomalies(wallet);

    res.json({
      employee_id: wallet.employee_id,
      balance: wallet.balance,
      issues,
    });
  } catch (err) {
    next(err);
  }
};

/**

 * ADMIN — View wallet transaction history

 */
export const getWalletTransactionsByEmployee = async (req, res, next) => {
  try {
    const { employeeId } = req.params;
    const wallet = await Wallet.findOne({ employee_id: employeeId });

    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }

    const transactions = await Transaction.find({
      wallet_id: wallet._id,
    }).sort({ createdAt: -1 });

    res.json({
      employee_id: employeeId,
      balance: wallet.balance,
      transactions,
    });
  } catch (err) {
    next(err);
  }
};
