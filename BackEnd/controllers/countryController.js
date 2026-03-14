import Country from "../models/countryModel.js";
import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json" with { type: "json" };

// Register the locale
countries.registerLocale(enLocale);

/**
 * @desc    Add a new country with automatic flag generation
 * @route   POST /auth/countries
 * @access  Private (Admin)
 */
export const addCountry = async (req, res) => {
  try {
    const { name, code, price, activeNumbers } = req.body;

    if (!name || !code || !price) {
      return res.status(400).json({ 
        success: false, 
        message: "Name, code, and price are required!" 
      });
    }

    // Get ISO 2-letter code from country name for flag generation
    const isoCode = countries.getAlpha2Code(name, "en");
    
    if (!isoCode) {
        return res.status(400).json({
            success: false,
            message: "Invalid country name. Could not generate flag."
        });
    }

    const flag = `https://flagcdn.com/w320/${isoCode.toLowerCase()}.png`;

    const newCountry = new Country({
      name,
      code,
      price,
      activeNumbers: activeNumbers || 0,
      flag
    });

    await newCountry.save();

    res.status(201).json({
      success: true,
      message: "Country added successfully!",
      country: newCountry
    });
  } catch (error) {
    console.error("❌ Add Country Error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error!",
      error: error.message 
    });
  }
};

/**
 * @desc    Get all countries
 * @route   GET /auth/countries
 * @access  Public
 */
export const getAllCountries = async (req, res) => {
  try {
    const countriesList = await Country.find().sort({ name: 1 });
    res.status(200).json({
      success: true,
      countries: countriesList
    });
  } catch (error) {
    console.error("❌ Get Countries Error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error!" 
    });
  }
};

/**
 * @desc    Delete a country
 * @route   DELETE /countries/deleteCountry/:id
 * @access  Private (Admin)
 */
export const deleteCountry = async (req, res) => {
  try {
    const { id } = req.params;

    const country = await Country.findByIdAndDelete(id);

    if (!country) {
      return res.status(404).json({
        success: false,
        message: "Country not found!"
      });
    }

    res.status(200).json({
      success: true,
      message: "Country deleted successfully!"
    });
  } catch (error) {
    console.error("❌ Delete Country Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error!"
    });
  }
};
