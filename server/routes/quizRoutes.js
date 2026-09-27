import express from 'express';
const router = express.Router();
import { generateQuiz, getQuizHistory, getQuizById, submitQuiz } from '../controllers/quizController.js';
import { protect } from '../middleware/authMiddleware.js';

router.post('/generate', protect, generateQuiz);
router.get('/history', protect, getQuizHistory);
router.route('/:id').get(protect, getQuizById);
router.post('/:id/submit', protect, submitQuiz);

export default router;
