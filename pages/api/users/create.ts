import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../lib/mongodb';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

// Define schema
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  passwordHash: String,
  role: { type: String, enum: ['admin', 'employee'] },
  reportsTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
});

// Avoid model overwrite error
const User = mongoose.models.User || mongoose.model('User', userSchema);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests allowed' });
  }

  await dbConnect();

  const { name, email, password, role, reportsTo } = req.body;

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, passwordHash, role, reportsTo });

    await newUser.save();
    res.status(201).json({ message: 'User created', user: newUser });
  } catch (error: any) {
    res.status(500).json({ message: 'User creation failed', error: error.message });
  }
}
