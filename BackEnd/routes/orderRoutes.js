import express from "express";
import jwt from "jsonwebtoken";
import { addOrder, getMyOrders, getAllOrders, updateOrderStatus } from "../controllers/orderController.js";
import { tokenVerifcation } from "../middleware/tokenVerification.js";

const router = express.Router();

router.post("/addOrder", tokenVerifcation, addOrder);            // Customer places order (auth required)
router.get("/getMyOrders", tokenVerifcation, getMyOrders);  // User fetches only their orders (auth required)
router.get("/getAllOrders", getAllOrders);                    // Admin fetches all orders
router.patch("/updateOrder/:id", updateOrderStatus);         // Admin updates order status

export default router;
