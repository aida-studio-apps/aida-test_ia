import { openai, DEPLOYMENT } from '../ai-client.js';
export async function askAiQuestion(question) {
    const completion = await openai.chat.completions.create({
        model: DEPLOYMENT,
        temperature: 0.2,
        messages: [
            {
                role: 'system',
                content: 'Tu es un assistant de test. Réponds de manière claire et concise à la question utilisateur.',
            },
            {
                role: 'user',
                content: question,
            },
        ],
    });
    return completion.choices[0]?.message?.content?.trim() || '';
}
