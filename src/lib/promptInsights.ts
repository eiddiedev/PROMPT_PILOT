import type { PromptSeed } from '../../seed/promptSeeds';

export type PromptDna = {
  clarity: number;
  structure: number;
  constraint: number;
  reusability: number;
};

export type MatchInsight = {
  score: number;
  reason: string;
  bestFor: string[];
  tradeoff: string;
  dna: PromptDna;
  matchedSignals: string[];
};

export type EvolutionInsight = {
  optimizedPrompt: string;
  explanation: string;
  changes: string[];
  feedbackTags: string[];
  beforeDna: PromptDna;
  afterDna: PromptDna;
};

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  codegen: ['生成', '搭建', '开发', '页面', '组件', '接口', 'api', '脚手架', 'mvp', '全栈', '前端', '后端', '测试'],
  debug: ['debug', 'bug', '报错', '错误', '调试', '定位', '修复', '回归', '性能', '异常', '崩溃', '边界'],
  study: ['学习', '理解', '解释', '笔记', '知识', '路线图', 'roadmap', '对比', '概念', '教程', '总结'],
  interview: ['面试', '简历', '求职', '岗位', 'interview', 'jd', 'star', '自我介绍', '算法题', 'mock'],
};

const FEEDBACK_PATTERNS: Array<{ label: string; terms: string[] }> = [
  { label: '结构不清晰', terms: ['结构', '格式', '层次', '不清晰', '不够清楚'] },
  { label: '缺少边界条件', terms: ['边界', '异常', '错误处理', '空值', '极端情况'] },
  { label: '缺少示例', terms: ['示例', '样例', 'case', '输入输出'] },
  { label: '不够工程化', terms: ['工程', '规范', '可维护', '专业'] },
  { label: '不适合初学者', terms: ['初学者', '入门', '太难', '不够易懂'] },
  { label: '约束不够强', terms: ['约束', '太泛', '太模糊', '不具体'] },
];

function clamp(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function unique(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

function countMatches(text: string, patterns: string[]) {
  return patterns.reduce((count, pattern) => count + (text.includes(pattern) ? 1 : 0), 0);
}

function toSearchText(prompt: PromptSeed) {
  return `${prompt.title} ${prompt.summary} ${prompt.scenario} ${prompt.tags.join(' ')} ${prompt.prompt}`.toLowerCase();
}

export function scorePromptDna(promptText: string): PromptDna {
  const text = promptText.toLowerCase();
  const lines = promptText.split('\n').filter((line) => line.trim());
  const headings = lines.filter((line) => /^#|^\d+\.|^[-*]\s/.test(line)).length;
  const placeholders = (promptText.match(/\{\{.+?\}\}/g) || []).length;
  const roleSignals = countMatches(text, ['你现在是', '请作为', 'act as', 'you are']);
  const formatSignals = countMatches(text, ['输出格式', '请输出', 'output format', 'json', 'table', 'markdown']);
  const constraintSignals = countMatches(text, ['要求', '必须', '规则', '不要', '确保', 'strictly', 'must']);
  const exampleSignals = countMatches(text, ['示例', 'example', '例如', '输入', '输出']);

  return {
    clarity: clamp(44 + roleSignals * 10 + formatSignals * 7 + exampleSignals * 4),
    structure: clamp(40 + headings * 6 + formatSignals * 10),
    constraint: clamp(36 + constraintSignals * 9 + formatSignals * 4),
    reusability: clamp(42 + placeholders * 12 + exampleSignals * 3 + (text.includes('变量') ? 6 : 0)),
  };
}

function deriveBestFor(prompt: PromptSeed) {
  const tagItems = prompt.tags.slice(0, 2);
  const scenarioItems = prompt.scenario
    .split(/[，、/]/)
    .map((item) => item.trim())
    .filter((item) => item.length >= 2 && item.length <= 10)
    .slice(0, 2);

  return unique([...tagItems, ...scenarioItems]).slice(0, 3);
}

function getTradeoff(prompt: PromptSeed) {
  const byCategory: Record<string, string> = {
    codegen: '更偏生成与结构搭建，不一定是最强的深度排障 Prompt。',
    debug: '更偏定位和修复，不一定适合从零产出完整方案。',
    study: '更偏理解与学习，不一定适合直接生成可上线代码。',
    interview: '更偏表达与问答准备，不一定适合真实项目实现。',
    product: '更偏产品思考，不一定适合落到具体技术细节。',
    research: '更偏调研和分析，不一定适合高约束交付。',
    creative: '更偏发散与创意，不一定适合强工程规范输出。',
  };

  if (prompt.tags.includes('Tests')) {
    return '更适合补强质量与边界覆盖，不一定是首版编码的第一选择。';
  }

  if (prompt.tags.includes('Performance')) {
    return '更适合定位性能问题，不一定覆盖功能正确性的全部风险。';
  }

  return byCategory[prompt.category] || '更适合特定场景，建议结合任务目标选择。';
}

function getMatchedSignals(prompt: PromptSeed, requirement: string) {
  const requirementText = requirement.toLowerCase();
  const haystack = toSearchText(prompt);
  const signalPool = unique([
    ...prompt.tags,
    ...CATEGORY_KEYWORDS[prompt.category] || [],
    ...prompt.title.split(/[\s/]+/),
  ]);

  return signalPool.filter((signal) => {
    const s = signal.toLowerCase();
    return s.length >= 2 && requirementText.includes(s) && haystack.includes(s);
  }).slice(0, 4);
}

export function buildPromptMatch(prompt: PromptSeed, requirement: string): MatchInsight {
  const requirementText = requirement.toLowerCase();
  const dna = scorePromptDna(prompt.prompt);
  const signals = getMatchedSignals(prompt, requirement);

  const categoryFit = countMatches(requirementText, CATEGORY_KEYWORDS[prompt.category] || []);
  const metadataFit = countMatches(requirementText, prompt.tags.map((tag) => tag.toLowerCase()));
  const scenarioFit = countMatches(requirementText, prompt.scenario.toLowerCase().split(/[，、\s/]+/));
  const score = clamp(
    38 +
    categoryFit * 10 +
    metadataFit * 8 +
    scenarioFit * 3 +
    signals.length * 5 +
    (dna.structure + dna.clarity + dna.constraint + dna.reusability) / 20,
  );

  const bestFor = deriveBestFor(prompt);
  const reasonBase = signals.length > 0 ? `命中了 ${signals.join('、')} 等关键信号` : '与该需求的任务类型和输出方式高度接近';
  const reason = `${reasonBase}，并且它的结构化程度与复用性更适合当前场景。`;

  return {
    score,
    reason,
    bestFor,
    tradeoff: getTradeoff(prompt),
    dna,
    matchedSignals: signals,
  };
}

export function deriveFeedbackTags(feedback: string) {
  const text = feedback.toLowerCase();
  const tags = FEEDBACK_PATTERNS.filter((pattern) => pattern.terms.some((term) => text.includes(term))).map((pattern) => pattern.label);
  return tags.length > 0 ? tags : ['可读性提升', '结构增强'];
}

export function buildPromptEvolution(originalPrompt: string, feedback: string): EvolutionInsight {
  const feedbackTags = deriveFeedbackTags(feedback);
  const changes: string[] = [];
  const sections: string[] = [];

  if (feedbackTags.some((tag) => ['结构不清晰', '可读性提升', '结构增强'].includes(tag))) {
    sections.push('## 输出结构\n1. 先概括目标\n2. 再拆解步骤\n3. 最后给出结果格式与注意事项');
    changes.push('增加明确的输出结构，降低模型自由发挥带来的不稳定性');
  }

  if (feedbackTags.includes('缺少边界条件')) {
    sections.push('## 边界条件\n- 处理空输入、异常输入与失败场景\n- 明确 fallback 行为\n- 如果无法完成，请说明缺失信息');
    changes.push('补充边界条件和失败路径，减少生成结果在异常场景下失真');
  }

  if (feedbackTags.includes('缺少示例')) {
    sections.push('## 示例\n- 提供至少 2 组输入输出示例\n- 包含 1 组边界情况示例');
    changes.push('增加示例输入输出，帮助模型锁定期望的结果格式');
  }

  if (feedbackTags.includes('不够工程化')) {
    sections.push('## 工程约束\n- 保持代码/输出可运行\n- 使用清晰命名\n- 标出风险点与验证方式');
    changes.push('加入工程约束，使输出更贴近真实开发工作流');
  }

  if (feedbackTags.includes('不适合初学者')) {
    sections.push('## 表达方式\n- 用易懂语言解释原因\n- 避免跳步\n- 先解释再给实现');
    changes.push('调整语气和解释深度，让提示词更适合初学者使用');
  }

  if (feedbackTags.includes('约束不够强')) {
    sections.push('## 约束\n- 严格按要求输出\n- 不要省略步骤\n- 不确定时说明假设');
    changes.push('强化约束语句，让模型输出更稳定、更可控');
  }

  const optimizedPrompt = [
    '# 角色与目标',
    '你是一名资深且谨慎的 AI 编程助手，请在理解需求后给出结构化、可执行、可验证的输出。',
    '',
    originalPrompt.trim(),
    '',
    ...sections,
  ].join('\n');

  const explanation = [
    '这次优化的重点不是改写措辞，而是增强 Prompt 的结构、约束与可复用性。',
    ...changes.map((change, index) => `${index + 1}. ${change}`),
  ].join('\n');

  return {
    optimizedPrompt,
    explanation,
    changes,
    feedbackTags,
    beforeDna: scorePromptDna(originalPrompt),
    afterDna: scorePromptDna(optimizedPrompt),
  };
}
