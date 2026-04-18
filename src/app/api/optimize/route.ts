import { NextResponse } from 'next/server';
import { buildPromptEvolution, scorePromptDna } from '../../../lib/promptInsights';
import { callDeepSeekJson } from '../../../lib/deepseek';

type OptimizeResponse = {
  optimizedPrompt: string;
  explanation: string;
  changes: string[];
  feedbackTags: string[];
  beforeDna: ReturnType<typeof scorePromptDna>;
  afterDna: ReturnType<typeof scorePromptDna>;
  source: 'deepseek' | 'local';
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const originalPrompt = typeof body?.originalPrompt === 'string' ? body.originalPrompt.trim() : '';
    const feedback = typeof body?.feedback === 'string' ? body.feedback.trim() : '';

    if (!originalPrompt) {
      return NextResponse.json({ error: 'originalPrompt is required' }, { status: 400 });
    }

    const normalizedFeedback = feedback || '请让这个 Prompt 更结构化、更具体、更适合工程场景。';

    try {
      const aiResult = await callDeepSeekJson<{
        optimizedPrompt: string;
        explanation: string;
        changes: string[];
        feedbackTags: string[];
      }>({
        systemPrompt:
          'You are a senior prompt engineer for AI coding and learning workflows. Always return valid JSON only. Improve prompts to be more structured, reliable, and reusable.',
        userPrompt: [
          '请根据原始 Prompt 和用户反馈，输出优化后的结果。',
          '输出 JSON 结构必须是：',
          '{"optimizedPrompt":"string","explanation":"string","changes":["string"],"feedbackTags":["string"]}',
          '要求：',
          '1. optimizedPrompt 必须是可直接复制使用的完整 Prompt。',
          '2. explanation 用中文，简洁说明优化策略。',
          '3. changes 需要是 3-6 条具体增强项。',
          '4. feedbackTags 需要是 2-4 个短标签。',
          '5. 保留原始意图，但增强结构、约束、示例、边界条件和表达清晰度。',
          '',
          `原始 Prompt：\n${originalPrompt}`,
          '',
          `用户反馈：\n${normalizedFeedback}`,
        ].join('\n'),
        maxTokens: 2200,
      });

      if (aiResult.optimizedPrompt) {
        const response: OptimizeResponse = {
          optimizedPrompt: aiResult.optimizedPrompt,
          explanation: aiResult.explanation || 'DeepSeek 已基于反馈对 Prompt 的结构和约束进行了增强。',
          changes: Array.isArray(aiResult.changes) ? aiResult.changes.slice(0, 6) : [],
          feedbackTags: Array.isArray(aiResult.feedbackTags) ? aiResult.feedbackTags.slice(0, 4) : [],
          beforeDna: scorePromptDna(originalPrompt),
          afterDna: scorePromptDna(aiResult.optimizedPrompt),
          source: 'deepseek',
        };

        return NextResponse.json(response);
      }
    } catch (error) {
      console.error('DeepSeek optimize failed, falling back to local analysis:', error);
    }

    const fallback = buildPromptEvolution(originalPrompt, normalizedFeedback);
    const fallbackResponse: OptimizeResponse = {
      ...fallback,
      source: 'local',
    };

    return NextResponse.json(fallbackResponse);
  } catch (error) {
    console.error('Optimize API failed:', error);
    return NextResponse.json({ error: 'optimize analysis failed' }, { status: 500 });
  }
}
