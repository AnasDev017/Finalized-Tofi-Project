import Number from "../models/numberModel.js";

// ─── Get numbers purchased by the logged-in user ───────────────────────────────
export const getMyNumbers = async (req, res) => {
  try {
    const myNumbers = await Number.find({
      user: req.user._id,
      status: "sold"
    })
      .populate("country", "name flag")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, numbers: myNumbers });
  } catch (error) {
    console.error("Error fetching user numbers:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
