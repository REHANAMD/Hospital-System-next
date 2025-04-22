import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongodb";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// User Schema
const userSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: { type: String, unique: true },
  password: String,
  department: String,
  role: { type: String, enum: ["admin", "employee"] },
  empId: String,      // for employees
  adminId: String     // for admins
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST requests allowed" });
  }

  const { name, phone, email, password, department, role } = req.body;

  if (!name || !phone || !email || !password || !department || !role) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    // Generate IDs
    const idPrefix = role === "admin" ? "ADM" : "EMP";
    const generatedId = idPrefix + Math.floor(1000 + Math.random() * 9000); // e.g., EMP4821

    const newUser = new User({
      name,
      phone,
      email,
      password: hashed,
      department,
      role,
      empId: role === "employee" ? generatedId : undefined,
      adminId: role === "admin" ? generatedId : undefined,
    });

    await newUser.save();

    return res.status(201).json({
      message: "User registered",
      userId: role === "admin" ? newUser.adminId : newUser.empId,
      role,
    });
  } catch (error: any) {
    return res.status(500).json({ message: "Registration failed", error: error.message });
  }
}
