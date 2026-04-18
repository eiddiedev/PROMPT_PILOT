# PROMPT_PILOT

AI 编程 / 学习场景的 Prompt 管理与优化平台。

这是一个为黑客松快速构建的 Web MVP，目标不是做“又一个 Prompt 收藏站”，而是把 Prompt 作为可管理、可匹配、可优化、可追溯的资产来展示。

## Why This Exists

在 AI 编程工作流里，Prompt 往往不是一次性文本，而是会不断经历：

- 场景选择
- 匹配推荐
- 使用反馈
- 迭代优化
- 收藏沉淀

`PROMPT_PILOT` 想解决的就是这个问题：

`别人管理 Prompt 文本，我们管理 Prompt 的使用场景与进化过程。`

## Core Features

### 1. Prompt Library

- 按场景分类浏览 Prompt
- 支持 `codegen / debug / study / interview`
- 支持查看详情、复制、收藏、分享思路

### 2. Prompt Match

- 输入需求后匹配最适合的 Prompt
- 给出匹配分数和推荐原因
- 让用户快速找到当前任务最合适的 Prompt

### 3. Prompt Optimize

- 输入原始 Prompt 或需求
- 生成更规范、更工程化的优化版本
- 同时给出优化说明

### 4. Community-Style Prompt Curation

- 内置精选 Prompt 与来源索引
- 支持展示 Prompt 来源与适用场景
- 强调 Prompt 的可追溯性，而不是纯复制粘贴

## Product Positioning

这个项目不是通用 Prompt marketplace，而是面向 AI 编程和学习场景的 Prompt 工作台。

更适合这类使用者：

- 使用 Trae / Copilot / Claude / DeepSeek 进行编程的人
- 需要整理高质量开发 Prompt 的学生与开发者
- 想把 Prompt 从“灵感”变成“资产”的团队

## Design Direction

UI 采用：

- 黑白工业栅格
- 档案面板式布局
- 少量橙色强调
- 强信息层级、弱花哨装饰

视觉规范见：

- [docs/ui-style-spec.md](./docs/ui-style-spec.md)

## Data & Sources

项目内已预置大量 Prompt 种子，并统一整理成结构化数据。

主要数据文件：

- [seed/promptSeeds.ts](./seed/promptSeeds.ts)
- [docs/source-index.md](./docs/source-index.md)

来源参考包括：

- [prompts.chat / f/awesome-chatgpt-prompts](https://github.com/f/awesome-chatgpt-prompts)
- [browser-use/awesome-prompts](https://github.com/browser-use/awesome-prompts)
- [github/awesome-copilot](https://github.com/github/awesome-copilot)
- [harish-garg/gemini-cli-prompt-library](https://github.com/harish-garg/gemini-cli-prompt-library)
- 若干 interview / prompt engineering 相关 gist

这些来源已被重新分类和改写，以适配当前产品结构。

## Tech Stack

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS

## Local Development

### 1. Install

```bash
npm install
```

### 2. Configure env

Create `.env.local`:

```bash
DEEPSEEK_API_KEY=your_api_key_here
```

### 3. Run

```bash
npm run dev
```

Open:

```bash
http://localhost:3000
```

### 4. Production build

```bash
npm run build
npm run start
```

## Pages

- `/` - 首页 Prompt 库
- `/match` - Prompt 匹配
- `/optimize` - Prompt 优化
- `/favorites` - 收藏页

## Project Structure

```text
src/app/                 app routes
src/components/          reusable UI components
seed/promptSeeds.ts      prompt seeds + community spotlights
docs/source-index.md     source references
docs/ui-style-spec.md    visual system
docs/traesolo-prompt-v2.md
```

## Hackathon Angle

这个项目最适合这样展示：

1. 用户输入需求
2. 系统匹配最适合的 Prompt
3. 用户提交反馈
4. 系统生成优化后的 Prompt
5. 用户收藏并沉淀为个人资产

一句话介绍可以说：

`PROMPT_PILOT is a prompt operating desk for AI coding workflows, not just a prompt collection site.`

## Next Steps

如果继续迭代，优先级建议：

- Prompt 版本历史
- 优化前后评分对比
- 来源筛选与推荐理由
- Prompt DNA / 质量画像
- 云端同步与用户系统
- 真实社区上传与收藏网络

## License

项目代码默认按仓库所有者意图管理。  
第三方 Prompt 来源请以各自仓库许可证为准；其中部分来源如 `prompts.chat` 为 `CC0-1.0`。
