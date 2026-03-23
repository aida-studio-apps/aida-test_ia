import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { openai, DEPLOYMENT } from './ai-client.js';
import aiTestRouter from './routes/ai-test.js';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = Number(process.env.PORT) || 3000;
app.use(cors());
app.use(express.json());
app.use('/api/ai-test', aiTestRouter);
// Health check
app.get('/api/health', (_req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
    });
});
// Example: Chat completion endpoint
app.post('/api/chat', async (req, res) => {
    try {
        const { messages } = req.body;
        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ error: 'messages array is required' });
        }
        const completion = await openai.chat.completions.create({
            model: DEPLOYMENT,
            messages,
            temperature: 0.7,
        });
        res.json({
            message: completion.choices[0]?.message,
            usage: completion.usage,
        });
    }
    catch (error) {
        console.error('Chat error:', error.message);
        res.status(500).json({ error: error.message });
    }
});
// Example: Streaming chat endpoint
app.post('/api/chat/stream', async (req, res) => {
    try {
        const { messages } = req.body;
        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ error: 'messages array is required' });
        }
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        const stream = await openai.chat.completions.create({
            model: DEPLOYMENT,
            messages,
            temperature: 0.7,
            stream: true,
        });
        for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
                res.write(`data: ${JSON.stringify({ content })}\n\n`);
            }
        }
        res.write('data: [DONE]\n\n');
        res.end();
    }
    catch (error) {
        console.error('Stream error:', error.message);
        if (!res.headersSent) {
            res.status(500).json({ error: error.message });
        }
    }
});
// Serve static frontend in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../dist')));
    app.get('*', (_req, res) => {
        res.sendFile(path.join(__dirname, '../dist/index.html'));
    });
}
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
});
