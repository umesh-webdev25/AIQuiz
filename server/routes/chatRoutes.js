import express from 'express';
const router = express.Router();
import { handleChat } from '../controllers/chatController.js';

router.post('/', handleChat);

export default router;
