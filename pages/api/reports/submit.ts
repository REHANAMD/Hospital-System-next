import type { NextApiRequest, NextApiResponse } from 'next';
import formidable, { File } from 'formidable';
import fs from 'fs';
import path from 'path';
import dbConnect from '../../../lib/mongodb';
import mongoose from 'mongoose';

export const config = {
  api: {
    bodyParser: false,
  },
};

const reportSchema = new mongoose.Schema({
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  fileUrl: String,
  submittedAt: { type: Date, default: Date.now }
}, { timestamps: true });

const Report = mongoose.models.Report || mongoose.model('Report', reportSchema);

// 🚀 Wrap parse in a promise
const parseForm = (req: NextApiRequest): Promise<{ fields: any; files: any }> => {
  const form = formidable({
    multiples: false,
    uploadDir: path.join(process.cwd(), '/public/uploads'),
    keepExtensions: true
  });

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Only POST allowed' });
    }
  
    try {
      await dbConnect();
      const { fields, files } = await parseForm(req);
  
      console.log('FIELDS:', fields);
      console.log('FILES:', files);
  
      const taskId = fields.taskId?.toString();
      const submittedBy = fields.submittedBy?.toString();
      const reportFile = (files.file as File[])[0];

  
      console.log('reportFile.filepath:', reportFile?.filepath);
  
      if (!reportFile || !reportFile.filepath) {
        return res.status(400).json({ message: 'File missing or invalid' });
      }
  
      const filename = path.basename(reportFile.filepath);
      const fileUrl = `/uploads/${filename}`;
  
      const report = new Report({
        taskId,
        submittedBy,
        fileUrl
      });
  
      await report.save();
  
      return res.status(201).json({ message: 'Report uploaded', report });
    } catch (error: any) {
      console.error('Upload failed:', error);
      return res.status(500).json({ message: 'Upload failed', error: error.message });
    }
  }
  
