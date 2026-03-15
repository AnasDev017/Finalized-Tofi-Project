import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({

  orderId: {
    type: String,
    unique: true
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  customer: {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String
    },
    whatsapp: {
      type: String
    }
  },

  number: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Number",
    required: true
  },

  country: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Country",
    required: true
  },

  purchasedNumber: {
    type: String
  },

  service: {
    type: String
  },

  payment: {
    method: {
      type: String,
      enum: ["easypaisa", "jazzcash", "crypto"],
      required: true
    },
    transactionId: {
      type: String
    },
    paymentSlip: {
      type: String
    }
  },

  amount: {
    type: Number,
    required: true
  },

  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  }

}, { timestamps: true });

export default mongoose.model("Order", OrderSchema);