import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongodb";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import axios from "axios";

const userSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
  password: String,
  department: String,
  role: String,
  empId: String,
  adminId: String,
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();
  console.log("LOGIN BODY →", req.body);

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST allowed" });
  }

  const { empId, password, role, token } = req.body;
  console.log("RECEIVED TOKEN: ", token);

  if (!empId || !password || !role) {
    return res.status(400).json({ message: "Missing fields" });
  }

  // 🔐 1. Validate reCAPTCHA
  try {
    const secret = "6LeqMyArAAAAAGxWXkzbjY8hN95Xg4SZ1mWD_Y6i"; // your secret key
    const verifyRes = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`
    );

    if (!verifyRes.data.success) {
      return res.status(400).json({ message: "reCAPTCHA failed" });
    }
  } catch (err) {
    return res.status(500).json({ message: "CAPTCHA check error" });
  }

  // 👤 2. Find user by empId or adminId
  const query = role === "admin" ? { adminId: empId } : { empId };
  const user = await User.findOne(query);

  if (!user) {
    return res.status(401).json({ message: "User not found" });
  }

  // 🔑 3. Check password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid password" });
  }

  // 🛡️ 4. Check role match
  if (user.role !== role) {
    return res.status(403).json({ message: "Role mismatch" });
  }
  console.log("✅ Sending back:", {
    adminId: user.adminId,
    empId: user.empId
  });
  
  return res.status(200).json({
    message: "Login successful",
    role: user.role,
    name: user.name,
    adminId: user.adminId,
    empId: user.empId,
  });
  
}
