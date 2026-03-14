import express from "express";
import { addNumber, getAllNumbers, deleteNumber } from "../controllers/numberController.js";

const router = express.Router();

// Routes
router.post("/addNumber", addNumber); // Private (Admin)
router.get("/getAllNumbers", getAllNumbers); // Public/Private
router.delete("/deleteNumber/:id", deleteNumber); // Private (Admin)

export default router;
