import Transaction from "../models/Transaction.js";
import Wallet from "../models/Wallet.model.js";

export const detectWalletAnomalies = async (wallet) => {
  const issues = [];

  // 1️⃣ Sudden high balance
  if (wallet.balance > 500000) {
    issues.push("Unusually high wallet balance");
  }

  // 2️⃣ Recent transactions
  const recentTxs = await Transaction.find({
    wallet_id: wallet._id,

    createdAt: {
      $gte: new Date(Date.now() - 60 * 60 * 1000), // last 1 hour
    },
  });

  const creditTxs = recentTxs.filter(
    (tx) => tx.type === "CREDIT" && tx.status === "SUCCESS"
  );

  // 3️⃣ Too many credits in short time
  if (creditTxs.length > 3) {
    issues.push("Multiple wallet credits in short duration");
  }

  // 4️⃣ Duplicate payroll credits
  const payrollRefs = creditTxs
    .map((tx) => tx.reference_id)
    .filter((ref) => ref.startsWith("PAYROLL_"));

  const duplicateRefs = payrollRefs.filter(
    (ref, index) => payrollRefs.indexOf(ref) !== index
  );

  if (duplicateRefs.length > 0) {
    issues.push("Duplicate payroll credit detected");
  }

  return issues;
};
