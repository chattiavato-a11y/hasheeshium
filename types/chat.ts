export type ChatRole = 'user' | 'bot' | 'system';

export interface ChatMessage {
  role: ChatRole;
  text: string;
  isLoading?: boolean;
}

export type AIProgressStatus =
  | 'uninitialized'
  | 'initializing'
  | 'loading'
  | 'ready'
  | 'fetching'
  | 'error';

export interface AIProgress {
  status: AIProgressStatus;
  message: string;
  progress?: number;
}
