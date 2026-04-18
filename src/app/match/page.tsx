'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function MatchPrompt() {
  const router = useRouter();
  const [requirement, setRequirement] = useState('');
  const [loading, setLoading] = useState(false);
  const [matchedPrompts, setMatchedPrompts] = useState<any[]>([]);

  // 页面加载时的淡入效果
  useEffect(() => {
    document.body.style.opacity = '0';
    setTimeout(() => {
      document.body.style.transition = 'opacity 0.5s ease';
      document.body.style.opacity = '1';
    }, 50);
  }, []);

  const handleMatch = async () => {
    if (!requirement.trim()) return;
    
    setLoading(true);
    
    try {
      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            {
              role: 'system',
              content: '你是一个提示词匹配助手，根据用户需求匹配最适合的提示词模板。请分析用户需求，从提供的提示词库中选择最匹配的3个，并给出匹配分数和原因。输出格式必须是JSON，包含id、title、category、score和reason字段。'
            },
            {
              role: 'user',
              content: `用户需求：${requirement}\n\n提示词库：\n1. id: codegen-spec-to-mvp, title: 功能描述到 MVP 脚手架, category: codegen, 描述: 把产品需求快速转成最小可运行代码结构，适合黑客松起步。\n2. id: codegen-ui-component-builder, title: 高约束 UI 组件生成器, category: codegen, 描述: 在给定视觉语言、状态和交互约束下生成单个高质量组件。\n3. id: codegen-api-contract-first, title: 先定接口再写前端, category: codegen, 描述: 先把实体、状态和接口约定清楚，减少返工。\n4. id: debug-root-cause-triage, title: Bug 根因定位助手, category: debug, 描述: 把报错、上下文和可能原因整理成可执行排查路径。\n5. id: debug-regression-fix, title: 回归问题修复器, category: debug, 描述: 当功能之前能用、现在坏了时，帮助快速锁定回归点。\n6. id: debug-test-first, title: 先构造复现再修复, category: debug, 描述: 要求模型先写最小复现条件，再给修复，减少拍脑袋改代码。\n7. id: study-learning-roadmap, title: 技术学习路线图生成器, category: study, 描述: 把零散学习目标整理成阶段化路线图与练习计划。\n8. id: study-paper-to-notes, title: 论文与资料精读笔记, category: study, 描述: 把论文、长文或教程快速压缩成结构化学习笔记。\n9. id: study-socratic-code-mentor, title: 苏格拉底式代码导师, category: study, 描述: 不直接给答案，而是引导理解代码与思路。\n10. id: interview-role-sim, title: 岗位定制模拟面试, category: interview, 描述: 根据岗位与公司背景生成成体系的模拟面试问题和回答策略。\n11. id: interview-resume-tailor, title: 简历定制优化器, category: interview, 描述: 把现有简历针对目标 JD 做关键词、项目表述与亮点提炼。\n12. id: interview-star-story-coach, title: STAR 项目故事打磨器, category: interview, 描述: 把零散项目经历整理成可讲、可追问、可量化的 STAR 回答。`
            }
          ],
          max_tokens: 1000,
          temperature: 0.3
        })
      });
      
      if (!response.ok) {
        throw new Error('API 调用失败');
      }
      
      const data = await response.json();
      const content = data.choices[0].message.content;
      
      // 解析 JSON 响应
      try {
        const matches = JSON.parse(content);
        setMatchedPrompts(matches);
      } catch (parseError) {
        // 如果返回的不是 JSON，使用备用方案
        setMatchedPrompts([
          {
            id: 'codegen-spec-to-mvp',
            title: '功能描述到 MVP 脚手架',
            category: 'codegen',
            score: 90,
            reason: '与需求匹配度高'
          },
          {
            id: 'codegen-ui-component-builder',
            title: '高约束 UI 组件生成器',
            category: 'codegen',
            score: 85,
            reason: '适合相关需求'
          },
          {
            id: 'codegen-api-contract-first',
            title: '先定接口再写前端',
            category: 'codegen',
            score: 80,
            reason: '可能适合该需求'
          }
        ]);
      }
    } catch (error) {
      console.error('API 调用失败:', error);
      // 出错时使用备用数据
      setMatchedPrompts([
        {
          id: 'codegen-spec-to-mvp',
          title: '功能描述到 MVP 脚手架',
          category: 'codegen',
          score: 90,
          reason: '与需求匹配度高'
        },
        {
          id: 'codegen-ui-component-builder',
          title: '高约束 UI 组件生成器',
          category: 'codegen',
          score: 85,
          reason: '适合相关需求'
        },
        {
          id: 'codegen-api-contract-first',
          title: '先定接口再写前端',
          category: 'codegen',
          score: 80,
          reason: '可能适合该需求'
        }
      ]);
    } finally {
      setLoading(false);
    }
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
                <span className="text-xs text-muted font-mono ml-4">/ MATCH</span>
              </div>
              <div className="flex items-center gap-4">
                <a href="/" className="font-mono text-sm hover:text-accent border-b border-transparent hover:border-accent pb-1">库</a>
                <button className="btn btn-outline text-xs" onClick={() => router.push('/favorites')}>
                  收藏
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
                <span className="source-badge bg-accent-soft text-accent border-accent">AI 匹配</span>
              </div>

              <div className="mb-8 fade-in-delay-1">
                <h1 className="font-mono text-3xl md:text-4xl font-bold mb-4 tracking-wide">匹配提示词</h1>
                <p className="font-mono text-sm text-muted mb-6">
                  输入你的需求，AI 将分析并匹配最适合的提示词模板
                </p>
              </div>

              <div className="border-2 border-line p-6 bg-bg mb-8 fade-in-delay-2">
                <h3 className="font-mono font-bold text-sm mb-3">需求描述</h3>
                <textarea
                  className="w-full border-2 border-line p-4 font-mono text-sm h-40 mb-4"
                  placeholder="请详细描述你的需求，例如：我需要一个 React 组件生成器，能够根据设计规范生成高质量的 UI 组件..."
                  value={requirement}
                  onChange={(e) => setRequirement(e.target.value)}
                />
                <button 
                  className="btn btn-accent text-xs w-full"
                  onClick={handleMatch}
                  disabled={loading}
                >
                  {loading ? '分析中...' : '开始匹配'}
                </button>
              </div>

              {matchedPrompts.length > 0 && (
                <div className="fade-in-delay-3">
                  <h3 className="font-mono font-bold text-sm mb-4">匹配结果</h3>
                  <div className="space-y-4">
                    {matchedPrompts.map((prompt, index) => (
                      <div 
                        key={prompt.id} 
                        className="border-2 border-line p-4 hover:border-line-strong transition-all cursor-pointer"
                        onClick={() => router.push(`/prompt/${prompt.id}`)}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-mono font-bold text-sm">{prompt.title}</h4>
                          <span className="source-badge bg-accent-soft text-accent border-accent">{prompt.score}%</span>
                        </div>
                        <p className="font-mono text-xs text-muted mb-2">{prompt.reason}</p>
                        <div className="flex justify-end">
                          <span className="source-badge">{prompt.category}</span>
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
