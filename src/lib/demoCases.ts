import { promptSeeds, type PromptSeed } from '../../seed/promptSeeds';
import { buildPromptEvolution, buildPromptMatch, type EvolutionInsight, type MatchInsight } from './promptInsights';

export type MatchDemoCase = {
  id: string;
  title: string;
  requirement: string;
  summary: string;
  topIds: string[];
};

export type OptimizeDemoCase = {
  id: string;
  title: string;
  originalPrompt: string;
  feedback: string;
};

export type MatchDemoResult = {
  summary: string;
  cards: Array<PromptSeed & MatchInsight>;
};

export type OptimizeDemoResult = EvolutionInsight & {
  title: string;
  originalPrompt: string;
  feedback: string;
};

export const MATCH_DEMO_CASES: MatchDemoCase[] = [
  {
    id: 'hackathon-mvp',
    title: '黑客松 MVP 搭建',
    requirement: '我想快速搭一个黑客松 MVP，需要页面结构、数据模型、关键组件和开发顺序，最好能直接开始写代码。',
    summary: '',
    topIds: ['codegen-spec-to-mvp', 'codegen-api-contract-first', 'codegen-ui-component-builder'],
  },
  {
    id: 'react-debug',
    title: 'React 报错排查',
    requirement: '我现在有一段 React 代码报错，想先定位根因，再补边界条件和回归验证，避免修一处坏两处。',
    summary: '这个案例更适合演示产品理解 AI 编程真实痛点，不是泛 Prompt 检索，而是具体到排障工作流。',
    topIds: ['debug-root-cause-triage', 'debug-regression-fix', 'debug-test-first'],
  },
  {
    id: 'frontend-interview',
    title: '前端面试准备',
    requirement: '我要准备前端面试，希望同时练项目表达、模拟问答和算法题复盘。',
    summary: '这个案例更适合展示 Prompt 不是单用途文本，而是可以围绕同一目标推荐不同角色的协同 Prompt。',
    topIds: ['interview-role-sim', 'interview-interviewer-roleplay', 'interview-leetcode-debrief'],
  },
];

export const OPTIMIZE_DEMO_CASES: OptimizeDemoCase[] = [
  {
    id: 'structure-upgrade',
    title: '把模糊需求升级成工程化 Prompt',
    originalPrompt: '帮我写一个登录页面',
    feedback: '输出不够结构化，而且缺少明确的输出格式。',
  },
  {
    id: 'debug-guardrails',
    title: '给 Debug Prompt 补边界条件',
    originalPrompt: '帮我修复这段 React 代码报错的问题。',
    feedback: '生成的代码有 bug，没有考虑空值和边界条件。',
  },
  {
    id: 'beginner-friendly',
    title: '让 Prompt 更适合初学者',
    originalPrompt: '请给我设计一份 React 状态管理学习计划。',
    feedback: '太像给高手看的，不适合初学者理解和照着执行。',
  },
];

function getPromptById(id: string) {
  return promptSeeds.find((prompt) => prompt.id === id);
}

export function getMatchDemoResult(caseId: string): MatchDemoResult | null {
  const demo = MATCH_DEMO_CASES.find((item) => item.id === caseId);
  if (!demo) return null;

  const cards = demo.topIds
    .map((id) => {
      const prompt = getPromptById(id);
      if (!prompt) return null;
      return {
        ...prompt,
        ...buildPromptMatch(prompt, demo.requirement),
      };
    })
    .filter(Boolean) as Array<PromptSeed & MatchInsight>;

  return {
    summary: demo.summary,
    cards,
  };
}

export function getOptimizeDemoResult(caseId: string): OptimizeDemoResult | null {
  const demo = OPTIMIZE_DEMO_CASES.find((item) => item.id === caseId);
  if (!demo) return null;

  return {
    title: demo.title,
    originalPrompt: demo.originalPrompt,
    feedback: demo.feedback,
    ...buildPromptEvolution(demo.originalPrompt, demo.feedback),
  };
}
