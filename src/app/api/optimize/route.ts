import { NextResponse } from 'next/server';
import { callDeepSeekJson } from '../../../lib/deepseek';
import {
  createAiOptimizationResult,
  createLocalOptimizationResult,
  normalizeOptimizationFeedback,
  type PromptOptimizationAiResponse,
} from '../../../lib/promptOptimization';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const originalPrompt = typeof body?.originalPrompt === 'string' ? body.originalPrompt.trim() : '';
    const feedback = typeof body?.feedback === 'string' ? body.feedback.trim() : '';

    if (!originalPrompt) {
      return NextResponse.json({ error: 'originalPrompt is required' }, { status: 400 });
    }

    const normalizedFeedback = normalizeOptimizationFeedback(feedback);

    try {
      const aiResult = await callDeepSeekJson<PromptOptimizationAiResponse>({
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
        return NextResponse.json(createAiOptimizationResult(originalPrompt, aiResult));
      }
    } catch (error) {
      console.error('DeepSeek optimize failed, falling back to local analysis:', error);
    }

    return NextResponse.json(createLocalOptimizationResult(originalPrompt, normalizedFeedback));
  } catch (error) {
    console.error('Optimize API failed:', error);
    return NextResponse.json({ error: 'optimize analysis failed' }, { status: 500 });
  }
}
