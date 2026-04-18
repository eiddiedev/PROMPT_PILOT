'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { promptSeeds, communitySpotlights, PromptSeed, CommunitySpotlight } from '../../seed/promptSeeds';

type PromptCategory = "codegen" | "debug" | "study" | "interview" | "community" | "product" | "research" | "creative" | 'all';

export default function Home() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<PromptCategory | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const filteredPrompts = selectedCategory === 'community' 
    ? communitySpotlights.map(spotlight => ({
        ...spotlight,
        summary: spotlight.recommendedFor,
        scenario: spotlight.comparisonSummary,
        tags: [spotlight.highlight.substring(0, 20)],
        prompt: `# ${spotlight.title}\n\n${spotlight.recommendedFor}\n\n${spotlight.comparisonSummary}\n\n${spotlight.highlight}`,
      }))
    : promptSeeds.filter(prompt => {
        const matchesCategory = selectedCategory === 'all' || prompt.category === selectedCategory;
        const matchesSearch = searchTerm === '' || 
          prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          prompt.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
          prompt.scenario.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
      });

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

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

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    // 记录使用次数
    recordUsage(id);
  };

  const recordUsage = (id: string) => {
    const usageData = JSON.parse(localStorage.getItem('promptUsage') || '{}');
    usageData[id] = (usageData[id] || 0) + 1;
    localStorage.setItem('promptUsage', JSON.stringify(usageData));
  };

  const getUsageCount = (id: string): number => {
    const usageData = JSON.parse(localStorage.getItem('promptUsage') || '{}');
    return usageData[id] || 0;
  };

  const getEfficiency = (id: string): number => {
    // 从本地存储获取用户评分
    const ratingsData = JSON.parse(localStorage.getItem('promptRatings') || '{}');
    return ratingsData[id] || 0;
  };

  const setRating = (id: string, rating: number) => {
    const ratingsData = JSON.parse(localStorage.getItem('promptRatings') || '{}');
    ratingsData[id] = rating;
    localStorage.setItem('promptRatings', JSON.stringify(ratingsData));
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
                <a href="/" className="font-mono text-sm hover:text-accent border-b border-transparent hover:border-accent pb-1">库</a>
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
                  <span className="font-mono text-xs text-muted">已索引 12 个结构化提示词</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="border-2 border-line p-6 fade-in-delay-1 hover:border-line-strong transition-all cursor-pointer" onClick={() => router.push('/match')}>
                  <h3 className="font-mono font-bold text-lg mb-3">🔍 匹配提示词</h3>
                  <p className="font-mono text-sm text-muted mb-4">输入你的需求，AI 将分析并匹配最适合的提示词</p>
                  <button className="btn btn-accent text-xs w-full">开始匹配</button>
                </div>
                <div className="border-2 border-line p-6 bg-accent-soft/20 fade-in-delay-2 hover:border-line-strong transition-all cursor-pointer" onClick={() => router.push('/optimize')}>
                  <h3 className="font-mono font-bold text-lg mb-3">⚡ 优化/生成提示词</h3>
                  <p className="font-mono text-sm text-muted mb-4">输入你的提示词或需求，AI 将生成高效的工程规范提示词</p>
                  <button className="btn btn-accent text-xs w-full">开始优化</button>
                </div>
              </div>
            </div>

            <div className="col-span-12 border-t-2 border-line-strong p-4 fade-in-delay-2">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <span className="font-pixel text-xl">项目 07</span>
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
                  <input
                    type="text"
                    placeholder="搜索提示词..."
                    className="px-3 py-2 border-2 border-line font-mono text-sm w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <button className="btn btn-outline text-xs">排序</button>
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
                          <span className="font-mono text-xs font-bold">{getEfficiency(prompt.id)}%</span>
                          <br />
                          <span className="text-xs text-muted">评分</span>
                        </div>
                        <div className="border border-line p-1">
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
