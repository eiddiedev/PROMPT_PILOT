'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { promptSeeds } from '../../seed/promptSeeds';
import { usePersistentPromptState } from '../hooks/usePersistentPromptState';

type PromptCategory = "codegen" | "debug" | "study" | "interview" | "community" | "product" | "research" | "creative" | 'all';

export default function Home() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<PromptCategory | 'all'>('all');
  const { favorites, ratings, usageCounts, toggleFavorite, setRating, recordUsage } = usePersistentPromptState();

  const communityFeaturedPrompts = useMemo(() => {
    const rankedPrompts = promptSeeds
      .map((prompt) => {
        const usage = usageCounts[prompt.id] || 0;
        const rating = ratings[prompt.id] || 0;
        const favoriteBonus = favorites.includes(prompt.id) ? 12 : 0;
        const baselineScore =
          (prompt.tags.includes('MVP') ? 8 : 0) +
          (prompt.tags.includes('Debug') ? 6 : 0) +
          (prompt.tags.includes('Learning') ? 4 : 0) +
          Math.min(prompt.tags.length * 1.5, 6);
        const communityScore = rating * 0.7 + Math.min(usage * 12, 100) * 0.3 + favoriteBonus + baselineScore;

        return {
          ...prompt,
          category: 'community' as const,
          summary:
            usage > 0 || rating > 0
              ? `来自真实使用反馈：当前评分 ${Math.round(rating / 20) || 0} 星，累计使用 ${usage} 次。`
              : prompt.summary,
          scenario:
            usage > 0 || rating > 0
              ? `高频使用 + 高评分 Prompt，适合加入社区精选推荐。原场景：${prompt.scenario}`
              : prompt.scenario,
          tags: [
            `评分 ${rating > 0 ? `${Math.round(rating / 20)}★` : '0★'}`,
            `使用 ${usage}`,
            ...prompt.tags.slice(0, 2),
          ],
          communityScore,
          rating,
          usage,
        };
      })
      .sort((a, b) => b.communityScore - a.communityScore);

    return rankedPrompts.slice(0, 9);
  }, [favorites, ratings, usageCounts]);

  const filteredPrompts =
    selectedCategory === 'community'
      ? communityFeaturedPrompts
      : promptSeeds.filter((prompt) => {
          const matchesCategory = selectedCategory === 'all' || prompt.category === selectedCategory;
          return matchesCategory;
        });

  const getCategoryLabel = (category: string): string => {
    switch (category) {
      case 'community': return '社区精选';
      case 'codegen': return '代码生成';
      case 'debug': return '调试排错';
      case 'study': return '学习研究';
      case 'interview': return '面试准备';
      case 'product': return '产品设计';
      case 'research': return '研究分析';
      case 'creative': return '创意生成';
      default: return category;
    }
  };

  const getUsageCount = (id: string): number => {
    return usageCounts[id] || 0;
  };

  const getEfficiency = (id: string): number => {
    return ratings[id] || 0;
  };

  const handlePromptClick = (prompt: any) => {
    // 记录使用次数
    if (prompt.id) {
      recordUsage(prompt.id);
    }
    // 平滑页面过渡
    document.body.style.opacity = '0.8';
    setTimeout(() => {
      if (prompt.id && prompt.prompt) {
        router.push(`/prompt/${prompt.id}`);
      }
    }, 100);
  };

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

            <div className="col-span-12 p-4">
              <div className="mb-6">
                <h1 className="hero-title mb-2 fade-in">PROMPT_PILOT</h1>
                <div className="flex items-center gap-4 fade-in-delay-1">
                  <span className="source-badge bg-accent-soft text-accent border-accent">精选</span>
                  <span className="font-mono text-xs text-muted">已索引 {promptSeeds.length} 个结构化提示词</span>
                  <span className="font-mono text-xs text-muted">本地持久化已开启</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="border-2 border-line p-6 fade-in-delay-1 hover:border-line-strong transition-all cursor-pointer" onClick={() => router.push('/match')}>
                  <h3 className="font-mono font-bold text-lg mb-3">
                    <svg className="w-5 h-5 inline-block mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="11" cy="11" r="8"></circle>
                      <path d="m21 21-4.35-4.35"></path>
                    </svg>
                    匹配提示词
                  </h3>
                  <p className="font-mono text-sm text-muted mb-4">输入你的需求，AI 将分析并匹配最适合的提示词</p>
                  <button className="btn btn-accent text-xs w-full">开始匹配</button>
                </div>
                <div className="border-2 border-line p-6 bg-accent-soft/20 fade-in-delay-2 hover:border-line-strong transition-all cursor-pointer" onClick={() => router.push('/optimize')}>
                  <h3 className="font-mono font-bold text-lg mb-3">
                    <svg className="w-5 h-5 inline-block mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                    </svg>
                    优化/生成提示词
                  </h3>
                  <p className="font-mono text-sm text-muted mb-4">输入你的提示词或需求，AI 将生成高效的工程规范提示词</p>
                  <button className="btn btn-accent text-xs w-full">开始优化</button>
                </div>
              </div>
            </div>

            <div className="col-span-12 border-t-2 border-line-strong p-4 fade-in-delay-2">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <span className="font-pixel text-xl">Prompt Library</span>
                  <div className="h-6 w-px bg-line"></div>
                  <div className="flex gap-2">
                    {(['all', 'community', 'codegen', 'debug', 'study', 'interview', 'product', 'research', 'creative'] as PromptCategory[]).map(category => (
                      <button
                        key={category}
                        className={`category-tab ${selectedCategory === category ? 'active' : ''} text-xs`}
                        onClick={() => setSelectedCategory(category)}
                      >
                        {getCategoryLabel(category)}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {filteredPrompts.map((prompt, index) => (
                  <div 
                    key={prompt.id} 
                    className={`prompt-card cursor-pointer fade-in-delay-${(index % 3) + 1}`}
                    onClick={() => handlePromptClick(prompt)}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className="source-badge">{getCategoryLabel(prompt.category)}</span>
                      <button 
                        className="text-muted hover:text-accent transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(prompt.id);
                        }}
                      >
                        {favorites.includes(prompt.id) ? '★' : '☆'}
                      </button>
                    </div>
                    <h3 className="font-mono font-bold text-sm mb-2">{prompt.title}</h3>
                    <p className="font-mono text-xs text-muted mb-4 line-clamp-2">{prompt.summary}</p>
                    <div className="border-t-2 border-line pt-3">
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="border border-line p-1">
                          <span className="font-mono text-xs font-bold">{getUsageCount(prompt.id)}</span>
                          <br />
                          <span className="text-xs text-muted">使用</span>
                        </div>
                        <div className="border border-line p-1">
                          <div className="flex justify-center gap-1 mb-1">
                            {[1, 2, 3, 4, 5].map(star => (
                              <button
                                key={star}
                                className={`text-xs ${star <= Math.round(getEfficiency(prompt.id) / 20) ? 'text-accent' : 'text-muted'}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setRating(prompt.id, star * 20);
                                }}
                              >
                                ★
                              </button>
                            ))}
                          </div>
                          <span className="text-xs text-muted">评分</span>
                        </div>
                        <div className="border border-line p-1 flex items-center justify-center">
                          <span className="font-mono text-xs font-bold">→</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
