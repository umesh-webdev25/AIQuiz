import mongoose from 'mongoose';

const codingProblemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    topic: {
      type: String,
      required: true
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard", "Mixed"],
      required: true
    },
    description: {
      type: String,
      required: true
    },
    examples: [
      {
        input: String,
        output: String,
        explanation: String
      }
    ],
    constraints: [String],
    starterCode: {
      javascript: String,
      java: String,
      python: String,
      cpp: String
    },
    driverCode: {
      javascript: String,
      java: String,
      python: String,
      cpp: String
    },
    testCases: [
      {
        input: String,
        expectedOutput: String,
        hidden: Boolean
      }
    ],
    generatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

const CodingProblem = mongoose.model('CodingProblem', codingProblemSchema);
export default CodingProblem;
