'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { promptSeeds, type PromptSeed } from '../../../seed/promptSeeds';
import { getMatchDemoResult, MATCH_DEMO_CASES } from '../../lib/demoCases';
import { buildPromptMatch, type MatchInsight, type PromptDna } from '../../lib/promptInsights';

type MatchCard = PromptSeed & MatchInsight;

const EXAMPLE_REQUIREMENTS = [
  '我需要先把一个产品想法快速搭成黑客松 MVP，最好能顺手定下页面结构和数据模型。',
  '我现在有一段 React 代码报错，想先定位根因，再补边界条件和测试。',
  '我想系统准备前端面试，需要模拟问答和项目表达。',
];

const DNA_LABELS = {
  Clarity: 'Clarity 清晰度',
  Structure: 'Structure 结构性',
  Constraint: 'Constraint 约束强度',
  Reusability: 'Reusability 可复用性',
} as const;

function getCategoryLabel(category: string) {
  switch (category) {
    case 'codegen':
      return '代码生成';
    case 'debug':
      return '调试排错';
    case 'study':
      return '学习研究';
    case 'interview':
      return '面试准备';
    default:
      return category;
  }
}

function DnaBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between font-mono text-[11px] uppercase tracking-wide text-muted">
        <span>{label}</span>
        <span className="text-text">{value}</span>
      </div>
      <div className="h-2 border border-line bg-panel">
        <div className="h-full bg-accent" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function DnaGrid({ dna }: { dna: PromptDna }) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <DnaBar label={DNA_LABELS.Clarity} value={dna.clarity} />
      <DnaBar label={DNA_LABELS.Structure} value={dna.structure} />
      <DnaBar label={DNA_LABELS.Constraint} value={dna.constraint} />
      <DnaBar label={DNA_LABELS.Reusability} value={dna.reusability} />
    </div>
  );
}

export default function MatchPrompt() {
  const router = useRouter();
  const [requirement, setRequirement] = useState('');
  const [loading, setLoading] = useState(false);
  const [matchedPrompts, setMatchedPrompts] = useState<MatchCard[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [analysisSource, setAnalysisSource] = useState<'deepseek' | 'local' | 'preset' | null>(null);
  const [summaryText, setSummaryText] = useState<string | null>(null);

  useEffect(() => {
    document.body.style.opacity = '0';
    setTimeout(() => {
      document.body.style.transition = 'opacity 0.5s ease';
      document.body.style.opacity = '1';
    }, 50);
  }, []);

  const topMatch = matchedPrompts[0];

  const recommendationSummary = useMemo(() => {
    if (summaryText) return summaryText;
    if (!topMatch) return null;

    return `最适合当前需求的是「${topMatch.title}」，因为它最贴近你的任务类型，并且在结构性与可复用性上更适合直接进入执行。`;
  }, [summaryText, topMatch]);

  const loadPresetDemo = (caseId: string) => {
    const demoCase = MATCH_DEMO_CASES.find((item) => item.id === caseId);
    const demoResult = getMatchDemoResult(caseId);

    if (!demoCase || !demoResult) return;

    setRequirement(demoCase.requirement);
    setMatchedPrompts(demoResult.cards);
    setSummaryText(demoResult.summary);
    setHasSearched(true);
    setAnalysisSource('preset');
    setLoading(false);
  };

  const handleMatch = async () => {
    if (!requirement.trim()) return;

    setLoading(true);
    setHasSearched(true);
    setAnalysisSource(null);
    setSummaryText(null);

    try {
      const response = await fetch('/api/match', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ requirement }),
      });

      if (!response.ok) {
        throw new Error('match api failed');
      }

      const data = await response.json();

      const localMap = new Map(
        promptSeeds.map((prompt) => [
          prompt.id,
          {
            ...prompt,
            ...buildPromptMatch(prompt, requirement),
          },
        ]),
      );

      const matches = (data.cards || [])
        .map((card: { id: string; reason?: string; bestFor?: string[]; tradeoff?: string; matchedSignals?: string[] }) => {
          const local = localMap.get(card.id);
          if (!local) return null;

          return {
            ...local,
            reason: card.reason || local.reason,
            bestFor: Array.isArray(card.bestFor) && card.bestFor.length > 0 ? card.bestFor : local.bestFor,
            tradeoff: card.tradeoff || local.tradeoff,
            matchedSignals:
              Array.isArray(card.matchedSignals) && card.matchedSignals.length > 0 ? card.matchedSignals : local.matchedSignals,
          };
        })
        .filter(Boolean) as MatchCard[];

      setMatchedPrompts(matches);
      setAnalysisSource(data.source === 'deepseek' ? 'deepseek' : 'local');
      setSummaryText(typeof data.summary === 'string' ? data.summary : null);
    } catch (error) {
      console.error('Match page failed, falling back to local analysis:', error);
      const fallbackMatches = promptSeeds
        .map((prompt) => ({
          ...prompt,
          ...buildPromptMatch(prompt, requirement),
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);

      setMatchedPrompts(fallbackMatches);
      setAnalysisSource('local');
      setSummaryText(null);
    } finally {
      setLoading(false);
    }
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
                  <span className="ml-0 font-mono text-xs text-muted md:ml-4">/ MATCH</span>
                </div>
                <div className="flex items-center gap-4">
                  <Link href="/" className="border-b border-transparent pb-1 font-mono text-sm hover:border-accent hover:text-accent">库</Link>
                  <Link href="/favorites" className="border-b border-transparent pb-1 font-mono text-sm hover:border-accent hover:text-accent">收藏</Link>
                </div>
              </div>
            </div>

            <div className="col-span-12 p-6">
              <div className="mb-6 flex items-center gap-4 fade-in-delay-1">
                <button className="btn btn-outline text-xs" onClick={() => router.back()}>
                  ← 返回
                </button>
                <span className="source-badge border-accent bg-accent-soft text-accent">Prompt Match</span>
                <span className="source-badge">推荐逻辑可解释</span>
              </div>

              <div className="mb-8 fade-in-delay-1">
                <h1 className="mb-3 font-mono text-3xl font-bold tracking-wide md:text-4xl">匹配最适合的 Prompt</h1>
                <p className="max-w-3xl font-mono text-sm text-muted">
                  不是简单返回 Top 3，而是根据你的任务目标、Prompt 结构强度与适用场景，给出可解释的推荐结果。
                </p>
              </div>

              <div className="mb-8 grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
                <div className="border-2 border-line bg-bg p-6 fade-in-delay-2">
                  <h3 className="mb-3 font-mono text-sm font-bold uppercase">任务描述</h3>
                  <textarea
                    className="mb-4 h-40 w-full border-2 border-line bg-panel p-4 font-mono text-sm"
                    placeholder="例如：我需要一个适合黑客松的 React MVP Prompt，能先梳理页面结构、核心组件和本地数据模型。"
                    value={requirement}
                    onChange={(e) => setRequirement(e.target.value)}
                  />
                  <button className="btn btn-accent w-full text-xs" onClick={handleMatch} disabled={loading}>
                    {loading ? '分析中...' : '开始匹配'}
                  </button>
                </div>

                <div className="border-2 border-line p-6 fade-in-delay-3">
                  <h3 className="mb-3 font-mono text-sm font-bold uppercase">示例需求</h3>
                  <div className="space-y-3">
                    {EXAMPLE_REQUIREMENTS.map((example) => (
                      <button
                        key={example}
                        className="w-full border border-line p-3 text-left font-mono text-xs transition-colors hover:border-accent hover:bg-accent-soft/30"
                        onClick={() => setRequirement(example)}
                      >
                        {example}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mb-8 border-2 border-line p-6 fade-in-delay-2">
                <div className="mb-4 flex items-center gap-3">
                  <span className="source-badge border-accent bg-accent-soft text-accent">预生成真实反馈结果</span>
                  <span className="font-mono text-xs text-muted">点一下直接载入完整演示结果，适合现场讲解</span>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  {MATCH_DEMO_CASES.map((demo) => (
                    <button
                      key={demo.id}
                      className="border border-line bg-bg p-4 text-left transition-colors hover:border-accent hover:bg-accent-soft/20"
                      onClick={() => loadPresetDemo(demo.id)}
                    >
                      <div className="mb-2 font-mono text-sm font-bold">{demo.title}</div>
                      <p className="font-mono text-xs text-muted line-clamp-4">{demo.requirement}</p>
                    </button>
                  ))}
                </div>
              </div>

              {topMatch && (
                <div className="mb-8 border-2 border-line-strong bg-accent-soft/15 p-6 fade-in-delay-2">
                  <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="mb-2 font-mono text-xs uppercase text-muted">Best Match</p>
                      <h2 className="mb-2 font-mono text-2xl font-bold">{topMatch.title}</h2>
                      <p className="max-w-3xl font-mono text-sm text-muted">{recommendationSummary}</p>
                      {analysisSource && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          <span className="source-badge border-accent text-accent">
                            {analysisSource === 'deepseek'
                              ? 'DeepSeek 分析'
                              : analysisSource === 'preset'
                                ? '预生成真实反馈结果'
                                : '本地回退分析'}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="border-2 border-accent bg-panel px-4 py-3 text-center">
                      <div className="font-pixel text-2xl text-accent">{topMatch.score}</div>
                      <div className="font-mono text-[11px] uppercase text-muted">Match Score</div>
                    </div>
                  </div>

                  <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                    <div className="border border-line bg-panel p-4">
                      <h3 className="mb-3 font-mono text-xs uppercase text-muted">Why This Prompt</h3>
                      <p className="mb-4 font-mono text-sm">{topMatch.reason}</p>
                      <div className="mb-4 flex flex-wrap gap-2">
                        {topMatch.bestFor.map((item) => (
                          <span key={item} className="source-badge border-accent text-accent">
                            {item}
                          </span>
                        ))}
                      </div>
                      <div className="border-t border-line pt-3">
                        <p className="mb-2 font-mono text-xs uppercase text-muted">Tradeoff</p>
                        <p className="font-mono text-xs text-muted">{topMatch.tradeoff}</p>
                      </div>
                    </div>

                    <div className="border border-line bg-panel p-4">
                      <h3 className="mb-3 font-mono text-xs uppercase text-muted">Prompt DNA</h3>
                      <DnaGrid dna={topMatch.dna} />
                    </div>
                  </div>
                </div>
              )}

              {hasSearched && matchedPrompts.length > 0 && (
                <div className="fade-in-delay-3">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-mono text-sm font-bold uppercase">Top 3 Matches</h3>
                    <span className="font-mono text-xs text-muted">每张卡都说明了推荐逻辑和取舍</span>
                  </div>

                  <div className="space-y-4">
                    {matchedPrompts.map((prompt, index) => (
                      <div
                        key={prompt.id}
                        className="cursor-pointer border-2 border-line p-5 transition-all hover:border-line-strong hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.08)]"
                        onClick={() => router.push(`/prompt/${prompt.id}`)}
                      >
                        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                          <div>
                            <div className="mb-2 flex flex-wrap items-center gap-2">
                              <span className="source-badge">{index === 0 ? 'Top Pick' : `Top ${index + 1}`}</span>
                              <span className="source-badge">{getCategoryLabel(prompt.category)}</span>
                              {prompt.matchedSignals.map((signal) => (
                                <span key={signal} className="source-badge text-muted">
                                  {signal}
                                </span>
                              ))}
                            </div>
                            <h4 className="mb-2 font-mono text-lg font-bold">{prompt.title}</h4>
                            <p className="mb-2 font-mono text-sm text-muted">{prompt.summary}</p>
                            <p className="font-mono text-xs">{prompt.reason}</p>
                          </div>

                          <div className="border-2 border-line bg-bg px-4 py-3 text-center">
                            <div className="font-pixel text-2xl text-accent">{prompt.score}</div>
                            <div className="font-mono text-[11px] uppercase text-muted">Score</div>
                          </div>
                        </div>

                        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                          <div className="border border-line bg-bg p-4">
                            <div className="mb-3 font-mono text-xs uppercase text-muted">Best For</div>
                            <div className="mb-4 flex flex-wrap gap-2">
                              {prompt.bestFor.map((item) => (
                                <span key={item} className="source-badge border-accent text-accent">
                                  {item}
                                </span>
                              ))}
                            </div>
                            <div className="border-t border-line pt-3">
                              <p className="mb-2 font-mono text-xs uppercase text-muted">Why Not Perfect</p>
                              <p className="font-mono text-xs text-muted">{prompt.tradeoff}</p>
                            </div>
                          </div>

                          <div className="border border-line bg-bg p-4">
                            <div className="mb-3 font-mono text-xs uppercase text-muted">Prompt DNA</div>
                            <DnaGrid dna={prompt.dna} />
                          </div>
                        </div>
                      </div>
                    ))}
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
