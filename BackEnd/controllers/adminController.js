import Number from "../models/numberModel.js";

// ─── Get all sold numbers (Admin) ─────────────────────────────────────────────
export const getSoldNumbers = async (req, res) => {
  try {
    const soldNumbers = await Number.find({ status: "sold" })
      .populate("user", "name email")
      .populate("country", "name flag")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, numbers: soldNumbers });
  } catch (error) {
    console.error("Error fetching sold numbers:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ─── Send OTP to a number (Admin) ─────────────────────────────────────────────
export const sendOtp = async (req, res) => {
  try {
    const { numberId, otp } = req.body;

    if (!numberId || !otp) {
      return res.status(400).json({ success: false, message: "numberId and otp are required" });
    }

    const numberDoc = await Number.findById(numberId);
    if (!numberDoc) {
      return res.status(404).json({ success: false, message: "Number not found" });
    }

    numberDoc.otp = { code: otp.toString().trim(), receivedAt: new Date() };
    await numberDoc.save();

    // Emit live update via Socket.io
    if (global.io && numberDoc.user) {
      global.io.to(numberDoc.user.toString()).emit("otpReceived", {
        numberId: numberDoc._id,
        otp: numberDoc.otp.code
      });
      console.log(`Socket emit: otpReceived sent to user ${numberDoc.user}`);
    }

    res.status(200).json({
      success: true,
      message: "OTP sent successfully!",
      otp: numberDoc.otp
    });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
