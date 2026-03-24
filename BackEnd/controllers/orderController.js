import Order from "../models/orderModel.js";
import Number from "../models/numberModel.js";
import Country from "../models/countryModel.js";
import Wallet from "../models/walletModel.js";
import User from "../models/userModel.js";


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

// ─── Buy Number (Instant Wallet-based) ───────────────────────────────────────
export const buyNumber = async (req, res) => {
  try {
    const { numberId } = req.body;
    const userId = req.user._id;

    console.log(`[Buy Attempt] User ID: ${userId}, Number ID: ${numberId}`);

    if (!numberId) {
      return res.status(400).json({ success: false, message: "Missing numberId in request" });
    }

    // Fetch the number to check price and availability
    const numberDoc = await Number.findById(numberId).populate("country");
    if (!numberDoc) {
      return res.status(404).json({ success: false, message: "Number not found in database" });
    }

    const currentStatus = (numberDoc.status || "").toLowerCase();
    if (currentStatus !== "available") {
      return res.status(400).json({ success: false, message: `Number status is '${numberDoc.status}', not available.` });
    }

    // Fetch the user's wallet
    let wallet = await Wallet.findOne({ user: userId });
    
    // Auto-create wallet if missing (with 0 balance)
    if (!wallet) {
      wallet = new Wallet({ user: userId, balance: 0 });
      await wallet.save();
    }

    if (wallet.balance < numberDoc.price) {
      return res.status(400).json({ success: false, message: `Insufficient balance! Needed: Rs${numberDoc.price}, Have: Rs${wallet.balance}` });
    }

    // Deduct the balance
    wallet.balance -= numberDoc.price;
    await wallet.save();

    // Mark the number as sold and link to buyer
    numberDoc.status = "sold";
    numberDoc.user = userId;
    await numberDoc.save();

    // Fetch user details for the order record (name/email)
    const user = await User.findById(userId);

    // Generate unique Order ID
    const orderId = "ORD-" + Math.floor(1000 + Math.random() * 9000);

    // Create the order with status "approved"
    const order = new Order({
      orderId,
      user: userId,
      customer: {
        name: user?.name || "User",
        email: user?.email || "N/A",
        phone: "",
        whatsapp: ""
      },
      number: numberDoc._id,
      country: numberDoc.country?._id || null,
      purchasedNumber: numberDoc.number,
      payment: {
        method: "wallet",
        transactionId: `WAL-${Date.now()}`
      },
      amount: numberDoc.price,
      status: "approved"
    });

    await order.save();

    res.status(200).json({
      success: true,
      message: "Number purchased successfully!",
      order,
      newBalance: wallet.balance
    });

  } catch (error) {
    console.error("Error buying number:", error);
    res.status(500).json({ success: false, message: "Internal server error: " + error.message });
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
