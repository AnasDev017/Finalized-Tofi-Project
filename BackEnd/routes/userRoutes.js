import express from "express";
import { getMyNumbers } from "../controllers/userController.js";
import { tokenVerifcation } from "../middleware/tokenVerification.js";

const router = express.Router();

// User: get all numbers purchased by logged-in user (includes OTP)
router.get("/my-numbers", tokenVerifcation, getMyNumbers);

export default router;
