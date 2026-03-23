export interface AskAiRequest {
  question: string;
}

export interface AskAiResponse {
  answer: string;
}

export interface ApiErrorResponse {
  error: string;
}

export interface AiTestState {
  question: string;
  answer: string;
  error: string;
  isLoading: boolean;
}

