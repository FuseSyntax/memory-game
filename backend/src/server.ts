import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// API Endpoints
app.get('/api/scores', async (req, res) => {
  const scores = await prisma.gameSession.findMany({
    orderBy: { timeTaken: 'asc' },
    take: 10,
  });
  res.json(scores);
});

app.post('/api/scores', async (req, res) => {
  const { playerName, timeTaken, moves, difficulty } = req.body;
  const newScore = await prisma.gameSession.create({
    data: { playerName, timeTaken, moves, difficulty }
  });
  res.json(newScore);
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});