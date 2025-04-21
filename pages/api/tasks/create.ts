import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../lib/mongodb';
import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  dueDate: Date,
  status: {
    type: String,
    enum: ['pending', 'submitted', 'overdue'],
    default: 'pending'
  }
}, { timestamps: true });

const Task = mongoose.models.Task || mongoose.model('Task', taskSchema);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests allowed' });
  }

  await dbConnect();

  const { title, description, assignedBy, assignedTo, dueDate } = req.body;

  try {
    const newTask = new Task({ title, description, assignedBy, assignedTo, dueDate });
    await newTask.save();

    res.status(201).json({ message: 'Task created', task: newTask });
  } catch (error: any) {
    res.status(500).json({ message: 'Task creation failed', error: error.message });
  }
}
