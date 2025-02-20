import express, { Request, Response, Application } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();
const app: Application = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key';

// Signup Endpoint
app.post('/api/signup', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, username } = req.body;
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({ error: 'Email already in use' });
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: { email, password: hashedPassword, username },
    });
    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Login Endpoint
app.post('/api/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(400).json({ error: 'Invalid email or password' });
      return;
    }
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      res.status(400).json({ error: 'Invalid email or password' });
      return;
    }
    const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Profile Endpoint
app.get('/api/profile', async (req: Request, res: Response): Promise<void> => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  try {
    const decoded = jwt.verify(token, SECRET_KEY) as JwtPayload & { userId: string };
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    res.json({ user });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// GET Game Sessions Endpoint
app.get('/api/user/sessions', async (req: Request, res: Response): Promise<void> => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  try {
    const decoded = jwt.verify(token, SECRET_KEY) as JwtPayload & { userId: string };
    const sessions = await prisma.gameSession.findMany({
      where: { userId: decoded.userId },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ sessions });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// POST Game Session Endpoint
app.post('/api/user/sessions', async (req: Request, res: Response): Promise<void> => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  try {
    const decoded = jwt.verify(token, SECRET_KEY) as JwtPayload & { userId: string };
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    // Destructure game session data from the request body
    const { timeTaken, moves, difficulty, result } = req.body;
    
    const newSession = await prisma.gameSession.create({
      data: {
        timeTaken,
        moves,
        difficulty,
        result,
        user: {
          connect: { id: user.id },
        },
      },
    });
    res.status(201).json({ message: 'Game session saved successfully', session: newSession });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
