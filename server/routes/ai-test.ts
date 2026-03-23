import { Router } from 'express';
import { askAiQuestion } from '../services/ai-test-service.js';

const router = Router();

router.post('/', async (req, res) => {
  const question = typeof req.body?.question === 'string' ? req.body.question.trim() : '';

  if (!question) {
    return res.status(400).json({ error: 'Veuillez saisir une question avant l’envoi.' });
  }

  try {
    const answer = await askAiQuestion(question);
    return res.status(200).json({ answer });
  } catch (error: any) {
    console.error('AI test route error:', error?.message || error);
    return res.status(503).json({ error: 'Erreur lors de l’appel au service IA.' });
  }
});

export default router;

