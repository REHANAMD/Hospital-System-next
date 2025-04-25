import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongodb";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import axios from "axios";
import jwt from "jsonwebtoken";

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

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST allowed" });
  }

  const { empId, password, role, token } = req.body;

  if (!empId || !password || !role) {
    return res.status(400).json({ message: "Missing fields" });
  }

  // 1. Verify reCAPTCHA
  try {
    const secret = process.env.RECAPTCHA_SECRET_KEY!;
    const verifyRes = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`
    );

    if (!verifyRes.data.success) {
      return res.status(400).json({ message: "reCAPTCHA failed" });
    }
  } catch (err) {
    return res.status(500).json({ message: "CAPTCHA check error" });
  }

  // 2. Find user
  const query = role === "admin" ? { adminId: empId } : { empId };
  const user = await User.findOne(query);

  if (!user) {
    return res.status(401).json({ message: "User not found" });
  }

  // 3. Check password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid password" });
  }

  // 4. Check role match
  if (user.role !== role) {
    return res.status(403).json({ message: "Role mismatch" });
  }

  // 5. Create JWT
  const jwtToken = jwt.sign(
    {
      id: user._id,
      adminId: user.adminId,
      empId: user.empId,
      name: user.name,
      role: user.role,
    },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  );

  // 6. Send token
  return res.status(200).json({
    message: "Login successful",
    token: jwtToken,
  });
}
