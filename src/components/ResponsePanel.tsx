interface ResponsePanelProps {
  answer: string;
  isLoading: boolean;
}

export function ResponsePanel({ answer, isLoading }: ResponsePanelProps) {
  return (
    <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
      <h2 className="mb-2 text-sm font-semibold text-gray-700">Réponse du service IA</h2>
      {isLoading ? (
        <p className="text-gray-500">Réception de la réponse en cours…</p>
      ) : answer ? (
        <p className="whitespace-pre-wrap text-gray-900">{answer}</p>
      ) : (
        <p className="text-gray-500">Aucune réponse pour le moment.</p>
      )}
    </div>
  );
}

