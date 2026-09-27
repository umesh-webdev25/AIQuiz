import Quiz from '../models/Quiz.js';
import { generateQuestions } from '../services/geminiService.js';

// @desc    Generate a new quiz
// @route   POST /api/quiz/generate
// @access  Private
const generateQuiz = async (req, res, next) => {
    try {
        const { topic, difficulty, count } = req.body;
        
        if (!topic || !difficulty || !count) {
            res.status(400);
            throw new Error('Please provide topic, difficulty, and count');
        }

        const rawQuestions = await generateQuestions(topic, difficulty, parseInt(count, 10));
        
        const formattedQuestions = rawQuestions.map(q => ({
            questionText: q.question,
            options: q.options,
            correctAnswer: q.correctAnswer
        }));

        const quiz = await Quiz.create({
            user: req.user._id,
            topic,
            difficulty,
            totalQuestions: formattedQuestions.length,
            questions: formattedQuestions
        });

        res.status(201).json(quiz);
    } catch (error) {
        next(error);
    }
};

// @desc    Get logged-in user's past quizzes
// @route   GET /api/quiz/history
// @access  Private
const getQuizHistory = async (req, res, next) => {
    try {
        const quizzes = await Quiz.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(quizzes);
    } catch (error) {
        next(error);
    }
};

// @desc    Get a single quiz's questions/results
// @route   GET /api/quiz/:id
// @access  Private
const getQuizById = async (req, res, next) => {
    try {
        const quiz = await Quiz.findById(req.params.id);

        if (!quiz) {
            res.status(404);
            throw new Error('Quiz not found');
        }

        if (quiz.user.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('Not authorized to view this quiz');
        }

        res.json(quiz);
    } catch (error) {
        next(error);
    }
};

// @desc    Submit answers, calculate & store score
// @route   POST /api/quiz/:id/submit
// @access  Private
const submitQuiz = async (req, res, next) => {
    try {
        const { answers } = req.body; // Array of user answers mapped to question index
        
        const quiz = await Quiz.findById(req.params.id);

        if (!quiz) {
            res.status(404);
            throw new Error('Quiz not found');
        }

        if (quiz.user.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('Not authorized to modify this quiz');
        }

        let score = 0;
        quiz.questions.forEach((q, index) => {
            q.userAnswer = answers[index];
            if (q.userAnswer === q.correctAnswer) {
                score += 1;
            }
        });

        quiz.score = score;
        await quiz.save();

        res.json(quiz);
    } catch (error) {
        next(error);
    }
};

export {
    generateQuiz,
    getQuizHistory,
    getQuizById,
    submitQuiz
};
