import CodingProblem from '../models/CodingProblem.js';
import UserCodingProgress from '../models/UserCodingProgress.js';
import { generateCodingProblems, generateCodingHint, generateCodingExplanation } from '../services/geminiService.js';
import { executeCode } from '../services/codeExecutionService.js';

export const generateProblems = async (req, res, next) => {
    try {
        const { topic, difficulty, count } = req.body;
        if (!topic || !count) {
            res.status(400);
            throw new Error('Topic and count are required');
        }

        const rawProblems = await generateCodingProblems(topic, difficulty || 'Mixed', count);
        
        // Save to DB
        const problemsToInsert = rawProblems.map(p => ({
            ...p,
            generatedBy: req.user._id
        }));
        
        const savedProblems = await CodingProblem.insertMany(problemsToInsert);
        res.status(201).json(savedProblems);
    } catch (error) {
        next(error);
    }
};

export const getProblems = async (req, res, next) => {
    try {
        const { topic } = req.query;
        const filter = {};
        if (topic) filter.topic = { $regex: new RegExp(topic, "i") };
        
        const problems = await CodingProblem.find(filter).sort({ createdAt: -1 }).limit(50);
        res.json(problems);
    } catch (error) {
        next(error);
    }
};

export const getProblemById = async (req, res, next) => {
    try {
        const problem = await CodingProblem.findById(req.params.id);
        if (!problem) {
            res.status(404);
            throw new Error('Problem not found');
        }
        // Remove hidden test cases for security before sending to client
        const safeProblem = problem.toObject();
        safeProblem.testCases = safeProblem.testCases.map(tc => ({
            input: tc.input,
            expectedOutput: tc.hidden ? undefined : tc.expectedOutput,
            hidden: tc.hidden
        }));
        res.json(safeProblem);
    } catch (error) {
        next(error);
    }
};

export const runCode = async (req, res, next) => {
    try {
        const { problemId, language, code, input } = req.body;
        const problem = await CodingProblem.findById(problemId);
        if (!problem) throw new Error('Problem not found');
        
        const fullCode = problem.driverCode[language].replace('// USER_CODE_HERE', code);
        const result = await executeCode(language, fullCode, input);
        res.json(result);
    } catch (error) {
        next(error);
    }
};

export const submitCode = async (req, res, next) => {
    try {
        const { problemId, language, code } = req.body;
        
        const problem = await CodingProblem.findById(problemId);
        if (!problem) {
            res.status(404);
            throw new Error('Problem not found');
        }

        let passed = 0;
        let failedTest = null;
        let executionResult = null;

        const fullCode = problem.driverCode[language].replace('// USER_CODE_HERE', code);

        for (let i = 0; i < problem.testCases.length; i++) {
            const tc = problem.testCases[i];
            const result = await executeCode(language, fullCode, tc.input, tc.expectedOutput);
            
            if (result.success && result.stdout.trim() === tc.expectedOutput.trim()) {
                passed++;
            } else {
                failedTest = i + 1;
                executionResult = result;
                break;
            }
        }

        const total = problem.testCases.length;
        const isAccepted = passed === total;

        // Update Progress
        let progress = await UserCodingProgress.findOne({ user: req.user._id, problem: problemId });
        if (!progress) {
            progress = new UserCodingProgress({ user: req.user._id, problem: problemId });
        }
        
        progress.attempts += 1;
        progress.language = language;
        progress.code = code;
        progress.lastSubmittedAt = Date.now();
        if (isAccepted) {
            progress.status = 'solved';
        } else if (progress.status !== 'solved') {
            progress.status = 'attempted';
        }
        await progress.save();

        if (isAccepted) {
            res.json({
                status: "Accepted",
                passed,
                total,
                runtime: "12 ms", // Mocked as Piston doesn't easily expose this accurately
                memory: "42 MB"
            });
        } else {
            res.json({
                status: executionResult?.error ? "Runtime Error" : "Wrong Answer",
                passed,
                total,
                failedTest,
                message: executionResult?.error || "Output does not match expected output.",
                stdout: executionResult?.stdout,
                stderr: executionResult?.stderr
            });
        }
    } catch (error) {
        next(error);
    }
};

export const getHint = async (req, res, next) => {
    try {
        const { problemId, code, language } = req.body;
        const problem = await CodingProblem.findById(problemId);
        if (!problem) throw new Error('Problem not found');
        
        const hint = await generateCodingHint(problem.description, code, language);
        res.json({ hint });
    } catch (error) {
        next(error);
    }
};

export const explainSolution = async (req, res, next) => {
    try {
        const { problemId, code, language } = req.body;
        const problem = await CodingProblem.findById(problemId);
        if (!problem) throw new Error('Problem not found');
        
        const explanation = await generateCodingExplanation(problem.description, code, language);
        res.json({ explanation });
    } catch (error) {
        next(error);
    }
};

export const getProgress = async (req, res, next) => {
    try {
        const progress = await UserCodingProgress.find({ user: req.user._id }).populate('problem', 'title topic difficulty');
        res.json(progress);
    } catch (error) {
        next(error);
    }
};
