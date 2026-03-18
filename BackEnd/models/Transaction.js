import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
  transactionId: {
    type: String,
    unique: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  method: {
    type: String,
    enum: ["easypaisa", "jazzcash", "nayapay", "crypto"],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  },
  type: {
    type: String,
    enum: ["deposit", "purchase"],
    default: "deposit"
  },
  paymentSlip: {
    type: String
  },
  note: {
    type: String
  }
}, { timestamps: true });

const Transaction = mongoose.model("Transaction", TransactionSchema);
export default Transaction;
