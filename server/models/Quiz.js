import mongoose from 'mongoose';

const quizSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        topic: {
            type: String,
            required: true,
        },
        difficulty: {
            type: String,
            required: true,
        },
        questions: [
            {
                questionText: String,
                options: [String],
                correctAnswer: String,
                userAnswer: String,
            },
        ],
        score: {
            type: Number,
            required: true,
            default: 0,
        },
        totalQuestions: {
            type: Number,
            required: true,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

const Quiz = mongoose.model('Quiz', quizSchema);
export default Quiz;
