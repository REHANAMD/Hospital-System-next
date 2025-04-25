import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/mongodb";
import Task from "@/models/task";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Only GET allowed" });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header missing" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    const adminId = (decoded as any).adminId;

    if (!adminId) {
      return res.status(403).json({ message: "Admin ID missing in token" });
    }

    // ✅ Return only active (pending) tasks assigned by this admin
    const tasks = await Task.find({ assignedBy: adminId, status: "pending" });

    return res.status(200).json({ tasks });

  } catch (error) {
    console.error("JWT ERROR:", error);
    return res.status(401).json({ message: "Invalid token" });
  }
}
