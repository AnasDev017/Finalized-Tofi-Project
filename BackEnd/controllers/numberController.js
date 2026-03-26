import Number from "../models/numberModel.js";
import Country from "../models/countryModel.js";

// Add a new virtual number
export const addNumber = async (req, res) => {
  try {
    const { number, countryName, price, service, description } = req.body;

    if (!number || !countryName || !price) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // Find country by name to get its ID
    const findCountry = await Country.findOne({ name: countryName });
    if (!findCountry) {
      return res.status(404).json({ success: false, message: "Country not found" });
    }

    const newNumber = new Number({
      number,
      country: findCountry._id,
      price,
      service,
      description,
      status: "available"
    });

    await newNumber.save();

    res.status(201).json({
      success: true,
      message: "Number added successfully!",
      newNumber
    });
  } catch (error) {
    console.error("Error adding number:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get all virtual numbers
export const getAllNumbers = async (req, res) => {
  try {
    const numbers = await Number.find().populate("country", "name flag");
    res.status(200).json({
      success: true,
      numbers
    });
  } catch (error) {
    console.error("Error fetching numbers:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Delete a virtual number
export const deleteNumber = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedNumber = await Number.findByIdAndDelete(id);

    if (!deletedNumber) {
      return res.status(404).json({ success: false, message: "Number not found" });
    }

    res.status(200).json({
      success: true,
      message: "Number deleted successfully!"
    });
  } catch (error) {
    console.error("Error deleting number:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
