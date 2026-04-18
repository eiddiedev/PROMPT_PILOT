import React, { useState, useEffect } from 'react';
import { PromptSeed } from '../../seed/promptSeeds';
import BeforeAfterDiff from './BeforeAfterDiff';

interface OptimizePanelProps {
  prompt: PromptSeed;
  feedback: string;
  onFeedbackChange: (feedback: string) => void;
}

// Mock 优化函数
const optimizePrompt = (originalPrompt: string, feedback: string): { optimized: string; explanation: string } => {
  let optimized = originalPrompt;
  let explanation = "";

  // 根据反馈关键词进行优化
  if (feedback.includes('不够结构化')) {
    optimized += "\n\n输出要求：请使用结构化格式，包括清晰的标题和分点内容。";
    explanation += "添加了结构化输出要求；";
  }

  if (feedback.includes('代码有 bug')) {
    optimized += "\n\n请在生成代码前检查可能的 bug，包括语法错误、边界条件和异常处理。";
    explanation += "添加了代码质量检查要求；";
  }

  if (feedback.includes('缺少边界条件')) {
    optimized += "\n\n请考虑并处理以下边界条件：空输入、无效参数、超时情况等。";
    explanation += "添加了边界条件处理要求；";
  }

  if (feedback.includes('不适合初学者')) {
    optimized += "\n\n请使用简单易懂的语言，避免专业术语，并提供详细的解释。";
    explanation += "调整了语气以适合初学者；";
  }

  // 如果没有具体反馈，添加一些通用优化
  if (feedback === '') {
    optimized += "\n\n请提供清晰、结构化的输出，并确保代码质量和边界条件处理。";
    explanation = "添加了通用优化建议，包括结构化输出和代码质量检查。";
  }

  return { optimized, explanation };
};

export default function OptimizePanel({ prompt, feedback, onFeedbackChange }: OptimizePanelProps) {
  const [optimizedResult, setOptimizedResult] = useState<{ optimized: string; explanation: string }>({
    optimized: prompt.prompt,
    explanation: ""
  });

  // 当反馈变化时重新优化
  useEffect(() => {
    const result = optimizePrompt(prompt.prompt, feedback);
    setOptimizedResult(result);
  }, [prompt.prompt, feedback]);

  const copyOptimizedToClipboard = () => {
    navigator.clipboard.writeText(optimizedResult.optimized);
  };

  return (
    <div className="mt-6 border-t border-line pt-4">
      <h4 className="font-mono text-sm uppercase mb-3">Optimize Prompt</h4>
      
      <div className="mb-4">
        <label className="font-mono text-xs text-muted mb-2 block">Feedback</label>
        <textarea
          className="w-full border border-line rounded-md p-3 font-mono text-sm h-24"
          placeholder="Enter your feedback (e.g., '输出不够结构化', '代码有 bug', '缺少边界条件', '不适合初学者')"
          value={feedback}
          onChange={(e) => onFeedbackChange(e.target.value)}
        />
      </div>
      
      <div className="mb-4">
        <h5 className="font-mono text-xs uppercase mb-2">Optimization Explanation</h5>
        <p className="font-mono text-xs">{optimizedResult.explanation || "Enter feedback to see optimization suggestions."}</p>
      </div>
      
      <div className="mb-4">
        <h5 className="font-mono text-xs uppercase mb-2">Before / After</h5>
        <BeforeAfterDiff 
          before={prompt.prompt}
          after={optimizedResult.optimized}
        />
      </div>
      
      <button className="btn btn-accent w-full" onClick={copyOptimizedToClipboard}>
        Copy Optimized Prompt
      </button>
    </div>
  );
}