interface QuestionFormProps {
  question: string;
  isLoading: boolean;
  onQuestionChange: (value: string) => void;
  onSubmit: () => void;
}

export function QuestionForm({
  question,
  isLoading,
  onQuestionChange,
  onSubmit,
}: QuestionFormProps) {
  return (
    <div className="space-y-3">
      <label htmlFor="question" className="block text-sm font-medium text-gray-700">
        Votre question
      </label>
      <textarea
        id="question"
        value={question}
        onChange={(e) => onQuestionChange(e.target.value)}
        placeholder="Ex: Bonjour, peux-tu me répondre ?"
        rows={4}
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
      <button
        type="button"
        onClick={onSubmit}
        disabled={isLoading}
        className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
      >
        {isLoading ? 'Envoi…' : 'Envoyer la question'}
      </button>
    </div>
  );
}

