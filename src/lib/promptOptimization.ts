import { buildPromptEvolution, scorePromptDna } from './promptInsights';

export const DEFAULT_OPTIMIZATION_FEEDBACK = '请让这个 Prompt 更结构化、更具体、更适合工程场景。';

export type PromptOptimizationAiResponse = {
  optimizedPrompt: string;
  explanation: string;
  changes: string[];
  feedbackTags: string[];
};

export type PromptOptimizationResult = {
  optimizedPrompt: string;
  explanation: string;
  changes: string[];
  feedbackTags: string[];
  beforeDna: ReturnType<typeof scorePromptDna>;
  afterDna: ReturnType<typeof scorePromptDna>;
  source: 'deepseek' | 'local';
};

export function normalizeOptimizationFeedback(feedback: string) {
  const normalizedFeedback = feedback.trim();
  return normalizedFeedback || DEFAULT_OPTIMIZATION_FEEDBACK;
}

export function createLocalOptimizationResult(originalPrompt: string, feedback: string): PromptOptimizationResult {
  const normalizedFeedback = normalizeOptimizationFeedback(feedback);

  return {
    ...buildPromptEvolution(originalPrompt, normalizedFeedback),
    source: 'local',
  };
}

export function createAiOptimizationResult(
  originalPrompt: string,
  aiResult: PromptOptimizationAiResponse,
): PromptOptimizationResult {
  return {
    optimizedPrompt: aiResult.optimizedPrompt,
    explanation: aiResult.explanation || 'DeepSeek 已基于反馈对 Prompt 的结构和约束进行了增强。',
    changes: Array.isArray(aiResult.changes) ? aiResult.changes.slice(0, 6) : [],
    feedbackTags: Array.isArray(aiResult.feedbackTags) ? aiResult.feedbackTags.slice(0, 4) : [],
    beforeDna: scorePromptDna(originalPrompt),
    afterDna: scorePromptDna(aiResult.optimizedPrompt),
    source: 'deepseek',
  };
}

export async function fetchPromptOptimization(
  originalPrompt: string,
  feedback: string,
  fetcher: typeof fetch = fetch,
): Promise<PromptOptimizationResult> {
  const response = await fetcher('/api/optimize', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      originalPrompt,
      feedback,
    }),
  });

  if (!response.ok) {
    throw new Error(`optimize api failed with status ${response.status}`);
  }

  return response.json() as Promise<PromptOptimizationResult>;
}
