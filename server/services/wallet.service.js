import Wallet from "../models/Wallet.model.js";
import Transaction from "../models/Transaction.js";

/**

 * Get or create wallet for employee

 */

export const getOrCreateWallet = async (employee_id) => {
  let wallet = await Wallet.findOne({ employee_id });
  if (!wallet) {
    wallet = await Wallet.create({ employee_id });
  }
  return wallet;
};

/**

 * Credit wallet (used by payroll)

 */

export const creditWallet = async ({
  employee_id,
  amount,
  reference_id,
  idempotency_key,
}) => {
  // Idempotency check

  const existingTx = await Transaction.findOne({ idempotency_key });
  if (existingTx) {
    return { message: "Duplicate request", transaction: existingTx };
  }
  const wallet = await getOrCreateWallet(employee_id);
  if (wallet.status !== "ACTIVE") {
    throw new Error("Wallet is blocked");
  }

  // Create transaction

  const transaction = await Transaction.create({
    wallet_id: wallet._id,
    type: "CREDIT",
    amount,
    reference_id,
    idempotency_key,
  });

  // Update balance

  wallet.balance += amount;
  await wallet.save();
  transaction.status = "SUCCESS";
  await transaction.save();

  return { wallet, transaction };
};
