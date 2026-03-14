import express from "express";
import { addCountry, getAllCountries, deleteCountry } from "../controllers/countryController.js";

const countryRoutes = express.Router();

// Public routes
countryRoutes.get("/getAllCountries", getAllCountries);

// Admin routes (later you can add tokenVerification here)
countryRoutes.post("/addCountry", addCountry);
countryRoutes.delete("/deleteCountry/:id", deleteCountry);

export default countryRoutes;
