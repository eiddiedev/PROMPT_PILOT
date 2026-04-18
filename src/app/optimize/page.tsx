'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getOptimizeDemoResult, OPTIMIZE_DEMO_CASES } from '../../lib/demoCases';
import { buildPromptEvolution, type PromptDna } from '../../lib/promptInsights';

const FEEDBACK_EXAMPLES = [
  '输出不够结构化，而且缺少明确的输出格式。',
  '生成的代码有 bug，没有考虑空值和边界条件。',
  '太像给高手看的，不适合初学者理解和照着执行。',
];

const DNA_LABELS = {
  Clarity: 'Clarity 清晰度',
  Structure: 'Structure 结构性',
  Constraint: 'Constraint 约束强度',
  Reusability: 'Reusability 可复用性',
} as const;

function DnaBar({ label, before, after }: { label: string; before: number; after: number }) {
  const delta = after - before;

  return (
    <div className="border border-line bg-panel p-3">
      <div className="mb-2 flex items-center justify-between font-mono text-[11px] uppercase tracking-wide text-muted">
        <span>{label}</span>
        <span className={delta >= 0 ? 'text-accent' : 'text-text'}>
          {before} → {after}
        </span>
      </div>
      <div className="space-y-2">
        <div>
          <div className="mb-1 font-mono text-[10px] uppercase text-muted">Before</div>
          <div className="h-2 border border-line bg-bg">
            <div className="h-full bg-line-strong/60" style={{ width: `${before}%` }} />
          </div>
        </div>
        <div>
          <div className="mb-1 font-mono text-[10px] uppercase text-muted">After</div>
          <div className="h-2 border border-line bg-bg">
            <div className="h-full bg-accent" style={{ width: `${after}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function DnaDiff({ before, after }: { before: PromptDna; after: PromptDna }) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <DnaBar label={DNA_LABELS.Clarity} before={before.clarity} after={after.clarity} />
      <DnaBar label={DNA_LABELS.Structure} before={before.structure} after={after.structure} />
      <DnaBar label={DNA_LABELS.Constraint} before={before.constraint} after={after.constraint} />
      <DnaBar label={DNA_LABELS.Reusability} before={before.reusability} after={after.reusability} />
    </div>
  );
}

export default function OptimizePrompt() {
  const router = useRouter();
  const [originalPrompt, setOriginalPrompt] = useState('');
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [optimizedPrompt, setOptimizedPrompt] = useState('');
  const [explanation, setExplanation] = useState('');
  const [changes, setChanges] = useState<string[]>([]);
  const [feedbackTags, setFeedbackTags] = useState<string[]>([]);
  const [beforeDna, setBeforeDna] = useState<PromptDna | null>(null);
  const [afterDna, setAfterDna] = useState<PromptDna | null>(null);
  const [copied, setCopied] = useState(false);
  const [analysisSource, setAnalysisSource] = useState<'deepseek' | 'local' | 'preset' | null>(null);

  useEffect(() => {
    document.body.style.opacity = '0';
    setTimeout(() => {
      document.body.style.transition = 'opacity 0.5s ease';
      document.body.style.opacity = '1';
    }, 50);
  }, []);

  const evolutionSummary = useMemo(() => {
    if (!afterDna || !beforeDna) return null;

    const gains: Array<[string, number]> = [
      [DNA_LABELS.Clarity, afterDna.clarity - beforeDna.clarity] as [string, number],
      [DNA_LABELS.Structure, afterDna.structure - beforeDna.structure] as [string, number],
      [DNA_LABELS.Constraint, afterDna.constraint - beforeDna.constraint] as [string, number],
      [DNA_LABELS.Reusability, afterDna.reusability - beforeDna.reusability] as [string, number],
    ];
    const strongestGain = gains.sort((a, b) => b[1] - a[1])[0];

    return `这次优化最明显提升的是 ${strongestGain[0]}，让 Prompt 从“能用”更接近“可复用、可解释、可控”的状态。`;
  }, [afterDna, beforeDna]);

  const handleOptimize = async () => {
    if (!originalPrompt.trim()) return;

    setLoading(true);
    setAnalysisSource(null);

    try {
      const response = await fetch('/api/optimize', {
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
        throw new Error('optimize api failed');
      }

      const result = await response.json();

      setOptimizedPrompt(result.optimizedPrompt);
      setExplanation(result.explanation);
      setChanges(result.changes);
      setFeedbackTags(result.feedbackTags);
      setBeforeDna(result.beforeDna);
      setAfterDna(result.afterDna);
      setAnalysisSource(result.source === 'deepseek' ? 'deepseek' : 'local');
    } catch (error) {
      console.error('Optimize page failed, falling back to local analysis:', error);
      const result = buildPromptEvolution(
        originalPrompt,
        feedback.trim() || '请让这个 Prompt 更结构化、更具体、更适合工程场景。',
      );

      setOptimizedPrompt(result.optimizedPrompt);
      setExplanation(result.explanation);
      setChanges(result.changes);
      setFeedbackTags(result.feedbackTags);
      setBeforeDna(result.beforeDna);
      setAfterDna(result.afterDna);
      setAnalysisSource('local');
    } finally {
      setLoading(false);
    }
  };

  const loadPresetDemo = (caseId: string) => {
    const demo = getOptimizeDemoResult(caseId);
    if (!demo) return;

    setOriginalPrompt(demo.originalPrompt);
    setFeedback(demo.feedback);
    setOptimizedPrompt(demo.optimizedPrompt);
    setExplanation(demo.explanation);
    setChanges(demo.changes);
    setFeedbackTags(demo.feedbackTags);
    setBeforeDna(demo.beforeDna);
    setAfterDna(demo.afterDna);
    setAnalysisSource('preset');
    setLoading(false);
  };

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="border-2 border-line-strong bg-panel shadow-[8px_8px_0px_0px_rgba(0,0,0,0.08)]">
          <div className="grid grid-cols-12 gap-0">
            <div className="col-span-12 border-b-2 border-line-strong p-4 fade-in">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center border-2 border-line-strong">
                      <span className="font-pixel text-xs">PP</span>
                    </div>
                    <span className="font-pixel text-2xl">PROMPT_PILOT</span>
                  </div>
                  <span className="ml-0 font-mono text-xs text-muted md:ml-4">/ OPTIMIZE</span>
                </div>
                <div className="flex items-center gap-4">
                  <a href="/" className="border-b border-transparent pb-1 font-mono text-sm hover:border-accent hover:text-accent">库</a>
                  <a href="/favorites" className="border-b border-transparent pb-1 font-mono text-sm hover:border-accent hover:text-accent">收藏</a>
                </div>
              </div>
            </div>

            <div className="col-span-12 p-6">
              <div className="mb-6 flex items-center gap-4 fade-in-delay-1">
                <button className="btn btn-outline text-xs" onClick={() => router.back()}>
                  ← 返回
                </button>
                <span className="source-badge border-accent bg-accent-soft text-accent">Prompt Evolution</span>
                <span className="source-badge">从反馈到版本进化</span>
              </div>

              <div className="mb-8 fade-in-delay-1">
                <h1 className="mb-3 font-mono text-3xl font-bold tracking-wide md:text-4xl">优化 Prompt，不只是改写 Prompt</h1>
                <p className="max-w-3xl font-mono text-sm text-muted">
                  这里展示的是 Prompt 的进化过程：原始文本、用户反馈、优化结果、增强项，以及前后质量画像的变化。
                </p>
              </div>

              <div className="mb-8 grid gap-6 lg:grid-cols-2">
                <div className="border-2 border-line bg-bg p-6 fade-in-delay-2">
                  <h3 className="mb-3 font-mono text-sm font-bold uppercase">原始 Prompt / 需求</h3>
                  <textarea
                    className="h-56 w-full border-2 border-line bg-panel p-4 font-mono text-sm"
                    placeholder="把你当前使用的 Prompt 或者一段模糊需求贴进来。"
                    value={originalPrompt}
                    onChange={(e) => setOriginalPrompt(e.target.value)}
                  />
                </div>

                <div className="border-2 border-line p-6 fade-in-delay-3">
                  <div className="mb-4">
                    <h3 className="mb-3 font-mono text-sm font-bold uppercase">使用反馈</h3>
                    <textarea
                      className="h-32 w-full border-2 border-line bg-panel p-4 font-mono text-sm"
                      placeholder="例如：输出不够结构化、缺少边界条件、太像给高手看的。"
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                    />
                  </div>
                  <div className="mb-4">
                    <div className="mb-2 font-mono text-xs uppercase text-muted">快速填充</div>
                    <div className="space-y-2">
                      {FEEDBACK_EXAMPLES.map((example) => (
                        <button
                          key={example}
                          className="w-full border border-line p-3 text-left font-mono text-xs transition-colors hover:border-accent hover:bg-accent-soft/30"
                          onClick={() => setFeedback(example)}
                        >
                          {example}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button className="btn btn-accent w-full text-xs" onClick={handleOptimize} disabled={loading}>
                    {loading ? '演化中...' : '生成进化版本'}
                  </button>
                </div>
              </div>

              <div className="mb-8 border-2 border-line p-6 fade-in-delay-2">
                <div className="mb-4 flex items-center gap-3">
                  <span className="source-badge border-accent bg-accent-soft text-accent">预生成真实反馈结果</span>
                  <span className="font-mono text-xs text-muted">点一下直接看到完整进化结果，适合稳定演示</span>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  {OPTIMIZE_DEMO_CASES.map((demo) => (
                    <button
                      key={demo.id}
                      className="border border-line bg-bg p-4 text-left transition-colors hover:border-accent hover:bg-accent-soft/20"
                      onClick={() => loadPresetDemo(demo.id)}
                    >
                      <div className="mb-2 font-mono text-sm font-bold">{demo.title}</div>
                      <p className="mb-2 font-mono text-xs text-muted line-clamp-3">{demo.originalPrompt}</p>
                      <p className="font-mono text-xs text-muted line-clamp-3">反馈：{demo.feedback}</p>
                    </button>
                  ))}
                </div>
              </div>

              {optimizedPrompt && beforeDna && afterDna && (
                <div className="space-y-6 fade-in-delay-3">
                  <div className="border-2 border-line-strong bg-accent-soft/15 p-6">
                    <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <p className="mb-2 font-mono text-xs uppercase text-muted">Evolution Summary</p>
                        <h2 className="mb-2 font-mono text-2xl font-bold">Prompt 已完成一次可视化进化</h2>
                        <p className="max-w-3xl font-mono text-sm text-muted">{evolutionSummary}</p>
                        {analysisSource && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            <span className="source-badge border-accent text-accent">
                              {analysisSource === 'deepseek'
                                ? 'DeepSeek 优化分析'
                                : analysisSource === 'preset'
                                  ? '预生成真实反馈结果'
                                  : '本地回退分析'}
                            </span>
                          </div>
                        )}
                      </div>
                      <button className="btn btn-outline text-xs" onClick={() => copyToClipboard(optimizedPrompt)}>
                        {copied ? '已复制' : '复制进化版'}
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {feedbackTags.map((tag) => (
                        <span key={tag} className="source-badge border-accent text-accent">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-6 lg:grid-cols-2">
                    <div className="border-2 border-line p-6 bg-bg">
                      <h3 className="mb-3 font-mono text-sm font-bold uppercase">Before</h3>
                      <pre className="max-h-[28rem] overflow-auto whitespace-pre-wrap font-mono text-xs">{originalPrompt}</pre>
                    </div>

                    <div className="border-2 border-line p-6 bg-bg">
                      <h3 className="mb-3 font-mono text-sm font-bold uppercase">After</h3>
                      <pre className="max-h-[28rem] overflow-auto whitespace-pre-wrap font-mono text-xs">{optimizedPrompt}</pre>
                    </div>
                  </div>

                  <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
                    <div className="border-2 border-line p-6">
                      <h3 className="mb-3 font-mono text-sm font-bold uppercase">Prompt Delta</h3>
                      <ul className="space-y-3">
                        {changes.map((change, index) => (
                          <li key={change} className="border border-line bg-bg p-3 font-mono text-xs">
                            <span className="mr-2 text-accent">0{index + 1}</span>
                            {change}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="border-2 border-line p-6">
                      <h3 className="mb-3 font-mono text-sm font-bold uppercase">Prompt DNA Before / After</h3>
                      <DnaDiff before={beforeDna} after={afterDna} />
                    </div>
                  </div>

                  <div className="border-2 border-line p-6">
                    <h3 className="mb-3 font-mono text-sm font-bold uppercase">优化说明</h3>
                    <pre className="whitespace-pre-wrap font-mono text-xs">{explanation}</pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
