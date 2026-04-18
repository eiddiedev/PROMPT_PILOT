'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { promptSeeds, communitySpotlights } from '../../../seed/promptSeeds';
import { usePersistentPromptState } from '../../hooks/usePersistentPromptState';

export default function FavoritesPage() {
  const router = useRouter();
  const [favoriteItems, setFavoriteItems] = useState<any[]>([]);
  const { favorites, ratings, usageCounts, toggleFavorite, setRating, recordUsage } = usePersistentPromptState();

  useEffect(() => {
    document.body.style.opacity = '0';
    setTimeout(() => {
      document.body.style.transition = 'opacity 0.5s ease';
      document.body.style.opacity = '1';
    }, 50);
  }, []);

  useEffect(() => {
    if (favorites.length > 0) {
      // 从 promptSeeds 和 communitySpotlights 中获取收藏的项目
      const allItems = [
        ...promptSeeds,
        ...communitySpotlights.map(spotlight => ({
          ...spotlight,
          summary: spotlight.recommendedFor,
          scenario: spotlight.comparisonSummary,
          tags: [spotlight.highlight.substring(0, 20)],
          prompt: `# ${spotlight.title}\n\n${spotlight.recommendedFor}\n\n${spotlight.comparisonSummary}\n\n${spotlight.highlight}`,
        }))
      ];
      
      const favItems = allItems.filter(item => favorites.includes(item.id));
      setFavoriteItems(favItems);
    } else {
      setFavoriteItems([]);
    }
  }, [favorites]);

  const getCategoryLabel = (category: string): string => {
    switch (category) {
      case 'codegen': return '代码生成';
      case 'debug': return '调试排错';
      case 'study': return '学习研究';
      case 'interview': return '面试准备';
      case 'community': return '社区精选';
      default: return category;
    }
  };

  const handleItemClick = (item: any) => {
    if (item.id) {
      recordUsage(item.id);
    }
    if (item.id && item.prompt) {
      document.body.style.opacity = '0.8';
      setTimeout(() => {
        router.push(`/prompt/${item.id}`);
      }, 100);
    }
  };

  const getUsageCount = (id: string): number => {
    return usageCounts[id] || 0;
  };

  const getEfficiency = (id: string): number => {
    return ratings[id] || 0;
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
                <span className="text-xs text-muted font-mono ml-4">/ FAVORITES</span>
              </div>
              <div className="flex items-center gap-4">
                <a href="/" className="font-mono text-sm hover:text-accent border-b border-transparent hover:border-accent pb-1">库</a>
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
                <span className="source-badge bg-accent-soft text-accent border-accent">我的收藏</span>
              </div>

              <div className="mb-8 fade-in-delay-1">
                <h1 className="hero-title mb-2">FAVORITES</h1>
                <p className="font-mono text-sm text-muted">
                  你收藏的提示词，可直接使用和管理。
                </p>
                <p className="mt-2 font-mono text-xs text-muted">收藏与评分保存在当前浏览器中。</p>
              </div>

              {favoriteItems.length > 0 ? (
                <div className="grid grid-cols-3 gap-4">
                  {favoriteItems.map((item, index) => (
                    <div 
                      key={item.id} 
                      className={`prompt-card cursor-pointer fade-in-delay-${(index % 3) + 1}`}
                      onClick={() => handleItemClick(item)}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <span className="source-badge">{getCategoryLabel(item.category)}</span>
                        <button 
                          className="text-accent hover:text-muted transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(item.id);
                          }}
                        >
                          ★
                        </button>
                      </div>
                      <h3 className="font-mono font-bold text-sm mb-2">{item.title}</h3>
                      <p className="font-mono text-xs text-muted mb-4 line-clamp-2">{item.summary}</p>
                      <div className="border-t-2 border-line pt-3">
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div className="border border-line p-1">
                            <span className="font-mono text-xs font-bold">{getUsageCount(item.id)}</span>
                            <br />
                            <span className="text-xs text-muted">使用</span>
                          </div>
                          <div className="border border-line p-1">
                            <div className="flex justify-center gap-1 mb-1">
                              {[1, 2, 3, 4, 5].map(star => (
                                <button
                                  key={star}
                                  className={`text-xs ${star <= Math.round(getEfficiency(item.id) / 20) ? 'text-accent' : 'text-muted'}`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setRating(item.id, star * 20);
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
              ) : (
                <div className="border-2 border-line p-8 text-center fade-in-delay-2">
                  <h3 className="font-mono font-bold text-sm mb-2">暂无收藏</h3>
                  <p className="font-mono text-xs text-muted mb-4">你还没有收藏任何提示词</p>
                  <button 
                    className="btn btn-accent text-xs"
                    onClick={() => router.push('/')}
                  >
                    去浏览提示词
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
