import Order from "../models/orderModel.js";
import Number from "../models/numberModel.js";
import Country from "../models/countryModel.js";

// ─── Add Order ────────────────────────────────────────────────────────────────
export const addOrder = async (req, res) => {
  try {
    const {
      customerName,
      customerEmail,
      customerPhone,
      customerWhatsapp,
      numberId,        // _id of the Number document
      paymentMethod,
      transactionId,
    } = req.body;

    // Validate required fields
    if (!customerName || !customerEmail || !numberId || !paymentMethod) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // Find the number (to get country, price, etc.)
    const numberDoc = await Number.findById(numberId).populate("country");
    if (!numberDoc) {
      return res.status(404).json({ success: false, message: "Number not found" });
    }

    // Generate unique Order ID
    const orderId = "ORD-" + Math.floor(1000 + Math.random() * 9000);

    const newOrder = new Order({
      orderId,
      // Link to logged-in user if token was provided (optional auth)
      user: req.user?._id || null,
      customer: {
        name: customerName,
        email: customerEmail,
        phone: customerPhone || "",
        whatsapp: customerWhatsapp || ""
      },
      number: numberDoc._id,
      country: numberDoc.country._id,
      purchasedNumber: numberDoc.number,
      service: numberDoc.service || "",
      payment: {
        method: paymentMethod,
        transactionId: transactionId || ""
      },
      amount: numberDoc.price,
      status: "pending"
    });

    await newOrder.save();

    // Populate for response
    const populated = await Order.findById(newOrder._id)
      .populate("number", "number price")
      .populate("country", "name flag");

    res.status(201).json({
      success: true,
      message: "Order placed successfully!",
      order: populated
    });

  } catch (error) {
    console.error("Error adding order:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ─── Get My Orders (Logged-in user only) ─────────────────────────────────────
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("number", "number price")
      .populate("country", "name flag")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ─── Get All Orders (Admin) ───────────────────────────────────────────────────
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("number", "number price")
      .populate("country", "name flag")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ─── Update Order Status (Admin) ──────────────────────────────────────────────
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value" });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    order.status = status;
    await order.save();

    // If approved → mark the number as "sold"
    if (status === "approved" && order.number) {
      await Number.findByIdAndUpdate(order.number, { status: "sold" });
    }

    const updated = await Order.findById(id)
      .populate("number", "number price")
      .populate("country", "name flag");

    res.status(200).json({
      success: true,
      message: `Order ${status} successfully!`,
      order: updated
    });

  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
