const OrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  number: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Number"
  },

  country: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Country"
  },

  service: {
    type: String
  },

  price: {
    type: Number
  },

  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  },

  paymentSlip: {
    type: String
  },

  transactionId: {
    type: String
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});