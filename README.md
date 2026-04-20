# PROMPT_PILOT

面向 AI 编程与学习场景的 Prompt 工作台。

`PROMPT_PILOT` 不是一个普通的 Prompt 收藏夹，而是把 Prompt 当成`可分析、可进化、可推荐、可沉淀`的工作流资产来管理。

## Status

这个仓库已经从黑客松 MVP 整理为可持续维护的开源项目基础版本。

- 可直接本地运行
- 无 `DEEPSEEK_API_KEY` 时仍可使用本地回退分析
- 内置 Prompt 种子带来源索引与改写说明
- 已补充 lint、test、build 的基础校验链路

## Core Highlights

### 1. Prompt Match

不是简单关键词检索，而是根据任务目标给出可解释推荐。

- 返回 `Top Matches`
- 展示 `Why This Prompt`
- 给出 `Best For / Tradeoff`
- 用 `Prompt DNA` 展示质量画像

### 2. Prompt Evolution

不是只改写一句 Prompt，而是把 Prompt 的优化过程可视化。

- 输入原始 Prompt 和使用反馈
- 输出优化后的 Prompt
- 展示 `Prompt Delta`
- 展示 `Before / After`
- 展示 `Prompt DNA Before / After`

### 3. Prompt DNA

每条 Prompt 都会从四个维度做画像：

- `Clarity 清晰度`
- `Structure 结构性`
- `Constraint 约束强度`
- `Reusability 可复用性`

这让 Prompt 不再只是文本，而是可以被评估和解释的资产。

### 4. Community-Style Curation

社区精选不是静态摆设，而是会结合本地真实交互行为动态浮出高价值 Prompt。

- 高评分 Prompt 更容易进入精选
- 高频使用 Prompt 更容易进入精选
- 收藏行为会参与热度排序

### 5. Source-Traceable Prompt Library

项目内置的 Prompt 都带有来源与改写说明，适合答辩时讲“为什么这些 Prompt 值得信任”。

- 来源可追溯
- 场景可解释
- 标签可筛选
- 适合继续扩展为团队 Prompt 资产库

## Why It Stands Out

在 AI 编程场景里，痛点通常不是“没有 Prompt”，而是：

- 不知道当前任务最适合哪条 Prompt
- 好 Prompt 用完就丢，无法形成反馈闭环
- 团队无法判断一个 Prompt 为什么好、差在哪
- 社区 Prompt 很多，但很难快速筛出真正能用的

`PROMPT_PILOT` 试图解决的就是这个问题：

`把 Prompt 从一次性输入框文本，升级成可管理、可分析、可优化的工作流系统。`

## What Is Already Built

- Prompt 分类管理
- Prompt 详情查看、复制、收藏、评分
- 任务到 Prompt 的智能匹配
- Prompt 优化与进化展示
- Prompt DNA 质量画像
- 社区精选逻辑
- 本地持久化状态
- 来源追溯与公开来源整理

## Built-In Prompt Data

项目内已预置并整理了多批 Prompt 种子数据，统一收敛为适合产品消费的结构。

当前内置覆盖：

- `codegen`
- `debug`
- `study`
- `interview`
- `product`
- `research`
- `creative`

总计 `50+` 条结构化 Prompt 种子，覆盖 AI 编程、学习、调试、产品分析、研究与创意场景。

主要数据文件：

- [seed/promptSeeds.ts](./seed/promptSeeds.ts)
- [docs/source-index.md](./docs/source-index.md)

数据来源参考包括：

- [prompts.chat / f/awesome-chatgpt-prompts](https://github.com/f/awesome-chatgpt-prompts)
- [browser-use/awesome-prompts](https://github.com/browser-use/awesome-prompts)
- [github/awesome-copilot](https://github.com/github/awesome-copilot)
- [harish-garg/gemini-cli-prompt-library](https://github.com/harish-garg/gemini-cli-prompt-library)
- 若干 interview / prompt engineering 相关 gist

这些内容均已按当前产品结构重组、筛选与改写。

## Product Surface

- `/` - Prompt 主库与社区精选
- `/match` - Prompt Match
- `/optimize` - Prompt Evolution
- `/favorites` - 收藏与回看
- `/prompt/[id]` - 单条 Prompt 详情

## Tech Stack

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Vitest

## Demo Scope

当前版本重点展示四件事：

- Prompt 主库浏览、收藏、评分与本地持久化
- 基于任务描述的 Prompt Match
- 基于反馈的 Prompt Evolution
- 可解释的 Prompt DNA 画像

暂未覆盖：

- 多用户系统
- 云端同步
- 社区上传审核
- 真正的版本历史与协作工作流

## Local Development

### Install

```bash
npm install
```

### Configure

Create `.env.local`:

```bash
DEEPSEEK_API_KEY=your_api_key_here
```

`DEEPSEEK_API_KEY` 是可选的。

- 配置后：`/match` 和 `/optimize` 会优先调用 DeepSeek
- 未配置时：应用会自动回退到本地分析逻辑，方便本地开发、演示和测试

### Run

```bash
npm run dev
```

Open:

```bash
http://localhost:3000
```

### Production Build

```bash
npm run lint
npm run test
npm run build
npm run start
```

## Project Structure

```text
src/app/                 app routes
src/components/          reusable UI components
src/lib/                 prompt insights, optimization helpers, persistence
seed/promptSeeds.ts      prompt seeds + community spotlights
docs/source-index.md     source references
docs/ui-style-spec.md    visual system
docs/traesolo-prompt-v2.md
```

## Quality Gates

```bash
npm run lint
npm run test
npm run build
```

CI runs the same checks on every pull request.

## Contributing

欢迎提 issue 和 PR。

- 贡献说明见 [CONTRIBUTING.md](./CONTRIBUTING.md)
- 社区行为准则见 [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md)
- 安全问题请看 [SECURITY.md](./SECURITY.md)

## Design Direction

产品采用黑白工业栅格、档案面板式布局与少量橙色强调，整体更接近 AI 工具工作台，而不是传统 SaaS 仪表盘。

视觉规范见：

- [docs/ui-style-spec.md](./docs/ui-style-spec.md)

## Roadmap

- Prompt 版本历史
- 优化前后更细粒度的效果对比
- 来源筛选与推荐理由强化
- 团队协作与共享资产库
- 云端同步与用户系统
- 真实社区上传与互动网络

## License

项目代码采用 [MIT](./LICENSE) 许可证。

关于内置 Prompt 数据，需要额外注意：

- 仓库内 Prompt 种子是基于公开来源进行筛选、重组与改写后的产品化内容
- 来源索引见 [docs/source-index.md](./docs/source-index.md)
- 第三方 Prompt 原始内容仍受各自许可证约束
- 若你计划将内置 Prompt 数据单独二次分发，请先核对对应来源许可证与使用范围
