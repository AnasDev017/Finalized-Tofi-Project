import mongoose from "mongoose";

const CountrySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  code: {
    type: String,
    trim: true,
  },

  flag: {
    type: String,
  },

  price: {
    type: Number,
    required: true,
  },

  activeNumbers: {
    type: Number,
    default: 0,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Country = mongoose.model("Country", CountrySchema);
export default Country