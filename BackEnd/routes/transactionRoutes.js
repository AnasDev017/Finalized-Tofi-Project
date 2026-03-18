import express from "express";
import { 
  createDeposit, 
  getMyTransactions, 
  getAllTransactions, 
  updateTransactionStatus,
  getWalletBalance
} from "../controllers/transactionController.js";
import { auth } from "../middleware/auth.js";
import { adminAuth } from "../middleware/adminAuth.js";

const router = express.Router();

// User Routes
router.post("/deposit", auth, createDeposit);
router.get("/my-transactions", auth, getMyTransactions);
router.get("/balance", auth, getWalletBalance);

// Admin Routes
router.get("/admin/all", getAllTransactions);
router.patch("/admin/update/:id", updateTransactionStatus);


export default router;
