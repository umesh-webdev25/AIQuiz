import mongoose from 'mongoose';

const userCodingProgressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    problem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CodingProblem',
      required: true
    },
    status: {
      type: String,
      enum: ['attempted', 'solved'],
      default: 'attempted'
    },
    language: {
      type: String,
    },
    code: {
      type: String,
    },
    attempts: {
      type: Number,
      default: 0
    },
    lastSubmittedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// Ensure a user only has one progress record per problem
userCodingProgressSchema.index({ user: 1, problem: 1 }, { unique: true });

const UserCodingProgress = mongoose.model('UserCodingProgress', userCodingProgressSchema);
export default UserCodingProgress;
