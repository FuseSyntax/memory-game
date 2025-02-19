"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
const port = 3001;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key';
// Signup Endpoint
app.post('/api/signup', async (req, res) => {
    try {
        const { email, password, username } = req.body;
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            res.status(400).json({ error: 'Email already in use' });
            return;
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const newUser = await prisma.user.create({
            data: { email, password: hashedPassword, username },
        });
        res.status(201).json({ message: 'User registered successfully', user: newUser });
    }
    catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
    }
});
// Login Endpoint
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            res.status(400).json({ error: 'Invalid email or password' });
            return;
        }
        const isValid = await bcryptjs_1.default.compare(password, user.password);
        if (!isValid) {
            res.status(400).json({ error: 'Invalid email or password' });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ message: 'Login successful', token });
    }
    catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
    }
});
// Profile Endpoint
app.get('/api/profile', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, SECRET_KEY);
        const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
        if (!user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        res.json({ user });
    }
    catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
});
// GET Game Sessions Endpoint
app.get('/api/user/sessions', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, SECRET_KEY);
        const sessions = await prisma.gameSession.findMany({
            where: { userId: decoded.userId },
            orderBy: { createdAt: 'desc' },
        });
        res.json({ sessions });
    }
    catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
});
// POST Game Session Endpoint
app.post('/api/user/sessions', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, SECRET_KEY);
        const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
        if (!user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        // Add result to the destructuring
        const { timeTaken, moves, difficulty, result } = req.body;
        const newSession = await prisma.gameSession.create({
            data: {
                timeTaken,
                moves,
                difficulty,
                result, // Now properly referenced
                user: {
                    connect: { id: user.id },
                },
            },
        });
        res.status(201).json({ message: 'Game session saved successfully', session: newSession });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
