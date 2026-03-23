import { useState } from 'react';
import type { ApiErrorResponse, AskAiResponse } from '../types';

export function useAiTest() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const submitQuestion = async () => {
    const trimmedQuestion = question.trim();

    if (!trimmedQuestion) {
      setError('Veuillez saisir une question avant l’envoi.');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: trimmedQuestion }),
      });

      const data = (await response.json()) as AskAiResponse | ApiErrorResponse;

      if (!response.ok) {
        throw new Error('error' in data ? data.error : 'Erreur lors de l’appel au service IA.');
      }

      if ('answer' in data) {
        setAnswer(data.answer);
      } else {
        throw new Error('Réponse IA invalide.');
      }
    } catch (err: any) {
      setError(err?.message || 'Erreur lors de l’appel au service IA.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    question,
    setQuestion,
    answer,
    error,
    isLoading,
    submitQuestion,
  };
}


