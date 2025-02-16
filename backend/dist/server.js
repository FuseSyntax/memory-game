"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
const port = 3001;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
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
