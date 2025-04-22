import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongodb";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  password: String,
  department: String,
  role: String,
  empId: String,
  adminId: String,
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { adminId, name, email, phone } = req.body;

  if (!adminId || !name || !email || !phone) {
    return res.status(400).json({ message: "Missing fields" });
  }

  try {
    const updatedUser = await User.findOneAndUpdate(
      { adminId },
      { name, email, phone },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json({ message: "Profile updated", user: updatedUser });
  } catch (err: any) {
    res.status(500).json({ message: "Update failed", error: err.message });
  }
}
