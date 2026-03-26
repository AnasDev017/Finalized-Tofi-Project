import mongoose from "mongoose";

const NumberSchema = new mongoose.Schema({
  number: {
    type: String,
    required: true
  },

  country: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Country"
  },

  price: {
    type: Number,
    required: true
  },

  status: {
    type: String,
    enum: ["available", "reserved", "sold"],
    default: "available"
  },

  service: {
    type: String
  },

  description: {
    type: String
  },

  otp: {
    code: { type: String, default: null },
    receivedAt: { type: Date, default: null }
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Number", NumberSchema);
