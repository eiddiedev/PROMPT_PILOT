import { describe, expect, it } from 'vitest';
import { buildPromptEvolution, buildPromptMatch, deriveFeedbackTags, scorePromptDna } from './promptInsights';
import { promptSeeds } from '../../seed/promptSeeds';

describe('promptInsights', () => {
  it('scores structured prompts higher on structure and constraint', () => {
    const plainPrompt = '帮我写一个 React 组件。';
    const structuredPrompt = [
      '# 角色',
      '你是一名资深前端工程师。',
      '',
      '## 输出格式',
      '1. 目录结构',
      '2. 完整代码',
      '3. 测试思路',
      '',
      '要求：',
      '- 必须使用 TypeScript',
      '- 输出 JSON 或 Markdown',
      '- 给出输入输出示例',
    ].join('\n');

    const plainDna = scorePromptDna(plainPrompt);
    const structuredDna = scorePromptDna(structuredPrompt);

    expect(structuredDna.structure).toBeGreaterThan(plainDna.structure);
    expect(structuredDna.constraint).toBeGreaterThan(plainDna.constraint);
  });

  it('returns matched signals for relevant prompt requirements', () => {
    const prompt = promptSeeds.find((item) => item.id === 'debug-root-cause-triage');

    expect(prompt).toBeDefined();

    const result = buildPromptMatch(prompt!, 'React 页面报错了，我想先定位 bug 根因并补测试。');

    expect(result.score).toBeGreaterThan(0);
    expect(result.reason.length).toBeGreaterThan(0);
    expect(result.matchedSignals.length).toBeGreaterThan(0);
  });

  it('extracts feedback tags from common optimization feedback', () => {
    const tags = deriveFeedbackTags('输出结构不清晰，而且缺少示例和边界条件。');

    expect(tags).toContain('结构不清晰');
    expect(tags).toContain('缺少示例');
    expect(tags).toContain('缺少边界条件');
  });

  it('builds a more structured evolution prompt from feedback', () => {
    const originalPrompt = '帮我优化一个前端组件。';
    const result = buildPromptEvolution(originalPrompt, '输出结构太模糊，缺少示例和边界条件。');

    expect(result.optimizedPrompt).toContain('## 输出结构');
    expect(result.optimizedPrompt).toContain('## 示例');
    expect(result.optimizedPrompt).toContain('## 边界条件');
    expect(result.afterDna.structure).toBeGreaterThanOrEqual(result.beforeDna.structure);
  });
});
