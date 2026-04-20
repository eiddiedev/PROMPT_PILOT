'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { promptSeeds, PromptSeed } from '../../../../seed/promptSeeds';
import { usePersistentPromptState } from '../../../hooks/usePersistentPromptState';
import { createLocalOptimizationResult, fetchPromptOptimization } from '../../../lib/promptOptimization';

export default function PromptDetail() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [prompt, setPrompt] = useState<PromptSeed | null>(null);
  const [copied, setCopied] = useState(false);
  const [showOptimizer, setShowOptimizer] = useState(false);
  const [optimizationFeedback, setOptimizationFeedback] = useState('');
  const [optimizedPrompt, setOptimizedPrompt] = useState('');
  const [optimizationExplanation, setOptimizationExplanation] = useState('');
  const [optimizationSource, setOptimizationSource] = useState<'deepseek' | 'local' | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const { favorites, ratings, usageCounts, toggleFavorite, setRating, recordUsage } = usePersistentPromptState();

  useEffect(() => {
    document.body.style.opacity = '0';
    setTimeout(() => {
      document.body.style.transition = 'opacity 0.5s ease';
      document.body.style.opacity = '1';
    }, 50);
  }, []);

  useEffect(() => {
    if (params.id) {
      const foundPrompt = promptSeeds.find(p => p.id === params.id);
      setPrompt(foundPrompt || null);
    }
  }, [params.id]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      // 记录使用次数
      if (prompt) {
        recordUsage(prompt.id);
      }
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  const getUsageCount = (id: string): number => {
    return usageCounts[id] || 0;
  };

  const getEfficiency = (id: string): number => {
    return ratings[id] || 0;
  };

  const sharePrompt = () => {
    if (typeof window !== 'undefined') {
      const url = window.location.href;
      if (navigator.share) {
        navigator.share({
          title: prompt?.title,
          text: prompt?.summary,
          url: url,
        });
      } else {
        copyToClipboard(url);
      }
    }
  };

  const getCategoryLabel = (category: string): string => {
    switch (category) {
      case 'codegen': return '代码生成';
      case 'debug': return '调试排错';
      case 'study': return '学习研究';
      case 'interview': return '面试准备';
      default: return category;
    }
  };

  const handleOptimize = async () => {
    if (!prompt || !optimizationFeedback.trim()) return;

    setIsOptimizing(true);
    setOptimizationSource(null);

    try {
      const result = await fetchPromptOptimization(prompt.prompt, optimizationFeedback);
      setOptimizedPrompt(result.optimizedPrompt);
      setOptimizationExplanation(result.explanation);
      setOptimizationSource(result.source);
    } catch (error) {
      console.error('Prompt detail optimize failed, falling back to local analysis:', error);
      const result = createLocalOptimizationResult(prompt.prompt, optimizationFeedback);
      setOptimizedPrompt(result.optimizedPrompt);
      setOptimizationExplanation(result.explanation);
      setOptimizationSource(result.source);
    } finally {
      setIsOptimizing(false);
    }
  };

  if (!prompt) {
    return (
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="border-2 border-line-strong bg-panel shadow-[8px_8px_0px_0px_rgba(0,0,0,0.08)] p-8">
            <h1 className="hero-title mb-4">PROMPT_PILOT</h1>
            <div className="border-2 border-line p-4">
              <h3 className="font-mono font-bold text-sm mb-2">提示词未找到</h3>
              <p className="font-mono text-xs text-muted mb-4">请检查链接是否正确。</p>
              <button 
                className="btn btn-accent text-xs"
                onClick={() => router.push('/')}
              >
                返回首页
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="border-2 border-line-strong bg-panel shadow-[8px_8px_0px_0px_rgba(0,0,0,0.08)]">
          <div className="grid grid-cols-12 gap-0">
            <div className="col-span-12 border-b-2 border-line-strong p-4 flex justify-between items-center fade-in">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 border-2 border-line-strong flex items-center justify-center">
                    <span className="font-pixel text-xs">PP</span>
                  </div>
                  <span className="font-pixel text-2xl">PROMPT_PILOT</span>
                </div>
                <span className="text-xs text-muted font-mono ml-4">/ LAB</span>
              </div>
              <div className="flex items-center gap-4">
                <Link href="/" className="font-mono text-sm hover:text-accent border-b border-transparent hover:border-accent pb-1">库</Link>
                <button className="btn btn-outline text-xs" onClick={() => router.push('/favorites')}>
                  收藏 ({favorites.length})
                </button>
              </div>
            </div>

            <div className="col-span-12 p-6">
              <div className="flex items-center gap-4 mb-6 fade-in-delay-1">
                <button 
                  className="btn btn-outline text-xs"
                  onClick={() => router.back()}
                >
                  ← 返回
                </button>
                <span className="source-badge">{getCategoryLabel(prompt.category)}</span>
                <button 
                  className="text-muted hover:text-accent transition-colors"
                  onClick={() => toggleFavorite(prompt.id)}
                >
                  {favorites.includes(prompt.id) ? '★ 已收藏' : '☆ 收藏'}
                </button>
              </div>

              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 fade-in-delay-1">
                <div>
                  <h1 className="font-mono text-2xl md:text-3xl font-bold mb-2">{prompt.title}</h1>
                  <p className="font-mono text-sm text-muted">{prompt.scenario}</p>
                  <p className="mt-2 font-mono text-xs text-muted">收藏、评分和使用记录会保存在当前浏览器。</p>
                </div>
                <div className="flex gap-2 mt-4 md:mt-0">
                  <button 
                    className="btn btn-outline text-xs"
                    onClick={() => copyToClipboard(prompt.prompt)}
                  >
                    {copied ? '已复制!' : '复制'}
                  </button>
                  <button 
                    className="btn btn-outline text-xs"
                    onClick={sharePrompt}
                  >
                    分享
                  </button>
                  <button 
                    className="btn btn-accent text-xs"
                    onClick={() => setShowOptimizer(!showOptimizer)}
                  >
                    优化
                  </button>
                </div>
              </div>

              {showOptimizer && (
                <div className="border-2 border-line-strong p-6 bg-accent-soft/20 mb-6 fade-in-delay-2">
                  <h3 className="font-mono font-bold text-sm mb-3">优化提示词</h3>
                  <textarea
                    className="w-full border-2 border-line p-4 font-mono text-sm h-32 mb-4"
                    placeholder="请描述你想要的优化方向，例如：需要更结构化的输出、添加边界条件、更适合初学者等..."
                    value={optimizationFeedback}
                    onChange={(e) => setOptimizationFeedback(e.target.value)}
                  />
                  <button 
                    className="btn btn-accent text-xs w-full"
                    onClick={handleOptimize}
                    disabled={isOptimizing}
                  >
                    {isOptimizing ? '优化中...' : '开始优化'}
                  </button>
                  
                  {optimizedPrompt && (
                    <div className="mt-6 space-y-4">
                      <div className="border-2 border-line p-4 bg-bg">
                        <div className="mb-2 flex items-center justify-between gap-2">
                          <h4 className="font-mono font-bold text-xs">优化后的提示词</h4>
                          {optimizationSource && (
                            <span className="source-badge border-accent text-accent">
                              {optimizationSource === 'deepseek' ? 'DeepSeek 优化分析' : '本地回退分析'}
                            </span>
                          )}
                        </div>
                        <pre className="font-mono text-xs whitespace-pre-wrap mb-2">{optimizedPrompt}</pre>
                        <button 
                          className="btn btn-outline text-xs"
                          onClick={() => copyToClipboard(optimizedPrompt)}
                        >
                          复制优化版
                        </button>
                      </div>
                      <div className="border-2 border-line p-4">
                        <h4 className="font-mono font-bold text-xs mb-2">优化说明</h4>
                        <pre className="font-mono text-xs whitespace-pre-wrap">{optimizationExplanation}</pre>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="border-2 border-line p-6 bg-bg mb-6 fade-in-delay-2">
                <pre className="font-mono text-xs whitespace-pre-wrap">{prompt.prompt}</pre>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 fade-in-delay-2">
                <div>
                  <h3 className="font-mono font-bold text-sm mb-3">标签</h3>
                  <div className="flex flex-wrap gap-2">
                    {prompt.tags.map(tag => (
                      <span key={tag} className="source-badge">{tag}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-mono font-bold text-sm mb-3">来源信息</h3>
                  <div className="space-y-2">
                    <a 
                      href={prompt.sourceUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="font-mono text-xs text-accent hover:underline block"
                    >
                      {prompt.sourceLabel}
                    </a>
                    {prompt.adaptationNote && (
                      <p className="font-mono text-xs text-muted">
                        改编说明：{prompt.adaptationNote}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="font-mono font-bold text-sm mb-3">统计与评分</h3>
                  <div className="space-y-2">
                    <p className="font-mono text-xs mb-2">
                      <span className="font-bold">使用次数：</span>{getUsageCount(prompt.id)}
                    </p>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          className={`text-sm ${star <= Math.round(getEfficiency(prompt.id) / 20) ? 'text-accent' : 'text-muted'}`}
                          onClick={() => setRating(prompt.id, star * 20)}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-mono font-bold text-sm mb-3">摘要</h3>
                  <p className="font-mono text-xs text-muted">{prompt.summary}</p>
                </div>
              </div>

              <div className="mt-8 fade-in-delay-3">
                <h3 className="font-mono font-bold text-sm mb-3">相关提示词</h3>
                <div className="grid grid-cols-3 gap-4">
                  {promptSeeds
                    .filter(p => p.category === prompt.category && p.id !== prompt.id)
                    .slice(0, 3)
                    .map((relatedPrompt, index) => (
                      <div 
                        key={relatedPrompt.id} 
                        className={`prompt-card cursor-pointer fade-in-delay-${index + 3}`}
                        onClick={() => router.push(`/prompt/${relatedPrompt.id}`)}
                      >
                        <h3 className="font-mono font-bold text-sm mb-2">{relatedPrompt.title}</h3>
                        <p className="font-mono text-xs text-muted line-clamp-2">{relatedPrompt.summary}</p>
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
