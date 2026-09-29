import { generateChatResponse } from '../services/geminiService.js';

const handleChat = async (req, res, next) => {
    try {
        const { message } = req.body;
        if (!message) {
            res.status(400);
            throw new Error("Message is required");
        }
        
        const responseText = await generateChatResponse(message);
        res.json({ reply: responseText });
    } catch (error) {
        next(error);
    }
};

export { handleChat };
