import express from 'express';
import Quiz from '../models/Quiz.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Middleware to protect routes
const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ message: 'No authentication token, access denied' });
        }

        const verified = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
        if (!verified) {
            return res.status(401).json({ message: 'Token verification failed, access denied' });
        }

        req.userId = verified.id;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is invalid' });
    }
};

// Save original quiz history item to DB
router.post('/', auth, async (req, res) => {
    try {
        const { title, score, total, percentage, timeSpent, categoryId, difficulty } = req.body;

        const newQuiz = new Quiz({
            userId: req.userId,
            title,
            score,
            total,
            percentage,
            timeSpent,
            categoryId,
            difficulty
        });

        const savedQuiz = await newQuiz.save();
        res.status(201).json(savedQuiz);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get quiz history for a user
router.get('/history', auth, async (req, res) => {
    try {
        const history = await Quiz.find({ userId: req.userId }).sort({ date: -1 });
        res.json(history);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

export default router;
