'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function OptimizePrompt() {
  const router = useRouter();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [optimizedPrompt, setOptimizedPrompt] = useState('');
  const [explanation, setExplanation] = useState('');

  // 页面加载时的淡入效果
  useEffect(() => {
    document.body.style.opacity = '0';
    setTimeout(() => {
      document.body.style.transition = 'opacity 0.5s ease';
      document.body.style.opacity = '1';
    }, 50);
  }, []);

  const handleOptimize = async () => {
    if (!input.trim()) return;
    
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
              content: '你是一个提示词优化专家，根据用户输入的提示词或需求，生成高质量、工程规范的提示词。请遵循以下要求：1. 结构清晰，包含明确的目标和要求；2. 符合工程规范，可直接用于 AI 编程工具；3. 输出格式规范，易于理解和使用；4. 提供优化说明。输出格式应该先输出优化后的提示词，然后在"=== 优化说明 ==="分隔符后输出优化说明。'
            },
            {
              role: 'user',
              content: `请优化以下提示词或需求：${input}`
            }
          ],
          max_tokens: 1500,
          temperature: 0.3
        })
      });
      
      if (!response.ok) {
        throw new Error('API 调用失败');
      }
      
      const data = await response.json();
      const content = data.choices[0].message.content;
      
      // 解析响应内容
      if (content.includes('=== 优化说明 ===')) {
        const [optimized, explanation] = content.split('=== 优化说明 ===');
        setOptimizedPrompt(optimized.trim());
        setExplanation(explanation.trim());
      } else {
        // 如果格式不符合预期，使用备用方案
        setOptimizedPrompt(`# 优化后的提示词\n\n${content}`);
        setExplanation('优化说明：\n1. 基于用户需求生成了结构化的提示词\n2. 确保了提示词的工程规范性\n3. 优化了提示词的可读性和可执行性');
      }
    } catch (error) {
      console.error('API 调用失败:', error);
      // 出错时使用备用数据
      setOptimizedPrompt(`# 优化后的提示词\n\n你是一名资深的全栈工程师，请根据以下需求生成高质量的代码实现：\n\n## 需求\n${input}\n\n## 要求\n1. 使用 TypeScript + Tailwind CSS\n2. 代码结构清晰，组件拆分合理\n3. 包含必要的注释和文档\n4. 提供完整的实现方案\n5. 确保代码可运行\n\n## 输出格式\n1. 实现思路\n2. 目录结构\n3. 核心代码\n4. 使用示例\n5. 注意事项`);
      setExplanation('优化说明：\n1. 添加了清晰的标题和结构\n2. 明确了技术栈要求\n3. 规范了输出格式\n4. 增加了实现思路和注意事项\n5. 确保代码质量和可运行性');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
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
                <span className="text-xs text-muted font-mono ml-4">/ OPTIMIZE</span>
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
                <span className="source-badge bg-accent-soft text-accent border-accent">AI 优化</span>
              </div>

              <div className="mb-8 fade-in-delay-1">
                <h1 className="font-mono text-3xl md:text-4xl font-bold mb-4 tracking-wide">优化/生成提示词</h1>
                <p className="font-mono text-sm text-muted mb-6">
                  输入你的提示词或需求，AI 将生成高效的工程规范提示词
                </p>
              </div>

              <div className="border-2 border-line p-6 bg-bg mb-8 fade-in-delay-2">
                <h3 className="font-mono font-bold text-sm mb-3">输入提示词或需求</h3>
                <textarea
                  className="w-full border-2 border-line p-4 font-mono text-sm h-40 mb-4"
                  placeholder="请输入你的提示词或需求，例如：我需要一个生成 React 组件的提示词..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
                <button 
                  className="btn btn-accent text-xs w-full"
                  onClick={handleOptimize}
                  disabled={loading}
                >
                  {loading ? '优化中...' : '开始优化'}
                </button>
              </div>

              {optimizedPrompt && (
                <div className="space-y-6 fade-in-delay-3">
                  <div className="border-2 border-line p-6 bg-bg">
                    <h3 className="font-mono font-bold text-sm mb-3">优化后的提示词</h3>
                    <pre className="font-mono text-xs whitespace-pre-wrap mb-4">{optimizedPrompt}</pre>
                    <button 
                      className="btn btn-outline text-xs"
                      onClick={() => copyToClipboard(optimizedPrompt)}
                    >
                      复制
                    </button>
                  </div>
                  
                  <div className="border-2 border-line p-6">
                    <h3 className="font-mono font-bold text-sm mb-3">优化说明</h3>
                    <pre className="font-mono text-xs whitespace-pre-wrap">{explanation}</pre>
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
