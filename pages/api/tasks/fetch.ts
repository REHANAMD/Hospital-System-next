import { NextApiRequest, NextApiResponse } from "next";
import Task from "@/models/task"; // Adjust this path based on where your Task model is located
import dbConnect from "@/lib/db";  // Your MongoDB connection file

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect(); // Connect to the database

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const tasks = await Task.find(); // Fetch tasks from your MongoDB collection
    res.status(200).json({ tasks });
  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks", error });
  }
}
