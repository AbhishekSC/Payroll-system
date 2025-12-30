import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    wallet_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Wallet",
      required: true,
    },

    type: {
      type: String,
      enum: ["CREDIT", "DEBIT"],
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 1,
    },

    status: {
      type: String,
      enum: ["PENDING", "SUCCESS", "FAILED"],
      default: "PENDING",
    },

    reference_id: {
      type: String,
      required: true,
    },

    idempotency_key: {
      type: String,
      required: true,
      unique: true,
    },
  },

  { timestamps: true }
);

export default mongoose.model("Transaction", transactionSchema);
