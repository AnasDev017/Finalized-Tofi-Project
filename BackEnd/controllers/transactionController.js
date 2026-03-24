import Transaction from "../models/Transaction.js";
import Wallet from "../models/walletModel.js";

export const createDeposit = async (req, res) => {
  try {
    const { method, amount, transactionId } = req.body;

    const txn = new Transaction({
      transactionId,
      user: req.user._id,
      method,
      amount,
      status: "pending",
      type: "deposit"
    });

    await txn.save();
    res.json({ success: true, message: "Deposit request submitted", txn });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyTransactions = async (req, res) => {
  try {
    const data = await Transaction.find({
      user: req.user._id
    }).sort({ createdAt: -1 });

    res.json({ success: true, transactions: data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllTransactions = async (req, res) => {
  try {
    const data = await Transaction.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json({ success: true, transactions: data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateTransactionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const txn = await Transaction.findById(id);

    if (!txn) {
      return res.status(404).json({ success: false, message: "Transaction not found" });
    }

    if (txn.status !== "pending") {
      return res.status(400).json({ success: false, message: "Already processed" });
    }

    txn.status = status;
    await txn.save();

    if (status === "approved") {
      let wallet = await Wallet.findOne({ user: txn.user });

      if (!wallet) {
        wallet = new Wallet({ user: txn.user, balance: 0 });
      }

      wallet.balance += txn.amount;
      await wallet.save();

      // Emit live wallet update
      if (global.io) {
        global.io.to(txn.user.toString()).emit("walletUpdated", {
          balance: wallet.balance
        });
        console.log(`Socket emit: walletUpdated sent to user ${txn.user} with balance ${wallet.balance}`);
      }
    }

    res.json({ success: true, message: "Transaction updated", txn });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getWalletBalance = async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ user: req.user._id });
    res.json({ success: true, balance: wallet ? wallet.balance : 0 });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
