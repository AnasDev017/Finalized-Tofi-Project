import express from "express";
import { addOrder, getAllOrders, updateOrderStatus } from "../controllers/orderController.js";

const router = express.Router();

router.post("/addOrder", addOrder);                    // Customer places order
router.get("/getAllOrders", getAllOrders);              // Fetch all orders (Admin + Dashboard)
router.patch("/updateOrder/:id", updateOrderStatus);  // Admin updates order status

export default router;
