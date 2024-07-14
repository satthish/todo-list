import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';

// Register a new user
export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  // Validate input
  if (!name || !email || !password) {
    return res.status(400).json({ Success: 0, message: 'Missing required fields', status: 400 });
  }

  // Check if user already exists
  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ Success: 0, message: 'User already registered', status: 400 });
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ email, username: name, password: hashedPassword });
    res.status(201).json({ Success: 1, message: 'User created successfully', status: 201 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ Success: 0, message: 'Error creating user', status: 500 });
  }
};

// Login a user
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ Success: 0, message: 'Missing required fields', status: 400 });
  }

  try {
    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ Success: 0, message: 'Invalid credentials', status: 401 });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
    res.json({ Success: 1, message: 'Login successful', token, status: 200 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ Success: 0, message: 'Error logging in', status: 500 });
  }
};
