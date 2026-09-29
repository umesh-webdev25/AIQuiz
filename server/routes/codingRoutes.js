import express from 'express';
const router = express.Router();
import {
    generateProblems,
    getProblems,
    getProblemById,
    runCode,
    submitCode,
    getHint,
    explainSolution,
    getProgress
} from '../controllers/codingController.js';
import { protect } from '../middleware/authMiddleware.js';

router.post('/problems/generate', protect, generateProblems);
router.get('/problems', protect, getProblems);
router.get('/problems/:id', protect, getProblemById);

router.post('/run', protect, runCode);
router.post('/submit', protect, submitCode);

router.post('/hint', protect, getHint);
router.post('/explain', protect, explainSolution);

router.get('/progress', protect, getProgress);

export default router;
