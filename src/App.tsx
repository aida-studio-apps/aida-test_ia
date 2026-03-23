import { ErrorMessage } from './components/ErrorMessage';
import { QuestionForm } from './components/QuestionForm';
import { ResponsePanel } from './components/ResponsePanel';
import { useAiTest } from './hooks/useAiTest';

export default function App() {
  const { question, setQuestion, answer, error, isLoading, submitQuestion } = useAiTest();

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-2xl space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">Test simple du service IA</h1>

        <QuestionForm
          question={question}
          isLoading={isLoading}
          onQuestionChange={setQuestion}
          onSubmit={submitQuestion}
        />

        <ErrorMessage message={error} />

        <ResponsePanel answer={answer} isLoading={isLoading} />
      </div>
    </div>
  );
}


