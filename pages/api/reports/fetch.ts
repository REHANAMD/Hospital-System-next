import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../lib/mongodb';
import mongoose from 'mongoose';

// ⛳️ Optional: remove 1MB limit
export const config = {
  api: {
    responseLimit: false,
  },
};

// 🗂 Define the Report schema
const reportSchema = new mongoose.Schema({
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  fileUrl: String,
  submittedAt: { type: Date, default: Date.now }
}, { timestamps: true });

const Report = mongoose.models.Report || mongoose.model('Report', reportSchema);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  try {
    const { taskId, submittedBy } = req.query;
    let query: any = {};

    if (taskId) query.taskId = taskId;
    if (submittedBy) query.submittedBy = submittedBy;

    const reports = await Report.find(query).select('-__v').lean();

    res.status(200).json({ message: 'Reports fetched', reports });
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching reports', error: error.message });
  }
}
