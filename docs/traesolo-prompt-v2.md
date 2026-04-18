# TraeSolo 生成提示词 V2

把下面整段直接交给 TraeSolo：

```text
你是一个资深全栈产品工程师与视觉系统设计师。请在当前工作区内直接为我生成一个最小可运行的黑客松 MVP。

项目名称：PromptPilot
副标题：AI 编程 / 学习场景的 Prompt 管理与优化平台

重要前提：
1. 你不能联网抓取网页
2. 当前工作区里已经有我整理好的本地素材，请直接读取并使用：
   - ./seed/promptSeeds.ts
   - ./docs/source-index.md
   - ./docs/ui-style-spec.md
3. 不要忽略这些文件，它们就是你的产品数据源、来源依据和视觉规范

项目目标：
在 3 小时黑客松场景里，做一个“可运行、可演示、视觉辨识度很强”的 Web MVP。

产品定位：
这是一个面向 Trae / AI 编程工具用户的 Prompt 工作台，核心是：
- 分类管理 Prompt
- 一键复制与收藏
- 根据使用反馈自动优化 Prompt
- 社区精选 Prompt 展示与推荐

技术要求：
- Next.js + TypeScript + Tailwind CSS
- 使用 App Router
- 不接数据库
- 使用本地 mock data 或 localStorage
- 项目必须能本地运行
- 代码结构清晰，组件拆分合理
- 先实现 MVP，避免过度工程化

请优先读取并使用 `./seed/promptSeeds.ts` 里的数据：
- `promptSeeds` 作为首页和详情页的核心数据
- `communitySpotlights` 作为社区精选和推荐模块的数据

功能要求：

一、Prompt 分类管理
- 展示四类 Prompt：代码生成、Debug、学习、面试
- 可切换分类
- 可搜索标题、标签、场景
- 每条 Prompt 支持：
  - 查看详情
  - 一键复制
  - 收藏
  - 分享链接（可先用 slug 方案）

二、Prompt 自动优化
- 在详情面板中提供“优化 Prompt”功能
- 用户输入使用反馈，例如：
  - 输出不够结构化
  - 代码有 bug
  - 缺少边界条件
  - 不适合初学者
- 系统基于原 Prompt + 反馈，返回：
  1. 优化后的 Prompt
  2. 优化说明
  3. 优化前后对比
- 第一版不要接真实模型 API
- 请写一个本地 `optimizePrompt()` 逻辑：
  - 能根据关键词注入输出格式要求
  - 能补充边界条件
  - 能补充调试日志 / 测试 / 示例输入输出
  - 能调整语气面向初学者、面试者或工程师

三、社区模块
- 基于 `communitySpotlights` 展示精选 Prompt
- 展示字段：
  - 标题
  - 类别
  - 推荐使用场景
  - 效果对比摘要
  - 来源标签
- 支持“一键收藏到我的 Prompt”
- 在 UI 上体现“社区精选”和“来源可追溯”

四、来源信息
- 产品里要有“来源”概念，但不要做复杂爬虫
- 在详情页或社区卡片中展示：
  - sourceLabel
  - sourceUrl
  - adaptationNote（如果适合展示）
- 让用户感觉这是一个可管理、可导入、可沉淀的 Prompt 系统

视觉风格要求：
严格参考 `./docs/ui-style-spec.md`，不要生成普通 SaaS 面板。

必须做到：
1. 首屏要有一个超大排版标题，例如 `PROMPT_ARCHIVE` / `PROMPT_SYSTEM`
2. 整个页面建立细线栅格和工业信息板结构
3. 主色以米白、黑、灰为主，只用少量橙色做行动按钮和状态强调
4. 页面像“实验室档案面板 + portfolio board + prompt catalog”，而不是数据看板
5. 不要使用紫色科技风、玻璃拟态、大阴影、花哨渐变

建议页面结构：
- 外层是一个被粗边框包住的大面板
- 顶部：品牌、少量导航、橙色 CTA
- 中间：巨大标题区 + 精选 Prompt 详情预览
- 中段：分类 tab + 搜索 + 视图控制
- 下段：3 列 Prompt 卡片网格
- 右侧或上侧固定一个详情/优化面板
- 底部：简短 CTA

信息架构建议：
- 左侧或顶部次导航：分类
- 中间：Prompt Grid
- 右侧：Detail Panel / Optimizer
- 单独一个 Community 视图或分区

组件要求：
- `ShellFrame`：负责整个工业栅格面板框架
- `TopBar`
- `HeroHeadline`
- `CategoryTabs`
- `PromptGrid`
- `PromptCard`
- `PromptDetailPanel`
- `OptimizePanel`
- `BeforeAfterDiff`
- `CommunitySpotlightGrid`
- `SourceBadge`

PromptCard 设计要求：
- 顶部小标签显示分类
- 中间显示标题
- 一句用途摘要
- 底部显示数据行，例如复制次数、收藏数、优化提升
- 边框清晰，尽量无阴影
- hover 只做轻微位移和边框强化

PromptDetailPanel 设计要求：
- 不是弹窗，而是页面结构的一部分
- 需要展示标题、场景、标签、Prompt 内容预览、来源、操作按钮
- 操作按钮：复制、收藏、优化

OptimizePanel 设计要求：
- 用户输入反馈后即时生成优化结果
- 显示优化说明
- 显示前后 Prompt 对比
- 可以保存优化后的版本到本地

交互要求：
- 页面初次加载有轻量入场动画
- 切换分类时要有克制过渡
- 卡片 hover 有细微动效
- 优化结果出现时要有明确反馈

数据要求：
- 直接使用 `./seed/promptSeeds.ts`
- 如需补充 UI 展示字段，可在本地扩展字段，但不要破坏原结构
- 首次加载就要展示完整内容

实现要求：
- 如果你需要额外的工具函数，请创建：
  - prompt filtering
  - favorites persistence
  - share slug generator
  - mock optimizer
- 如有必要，可以创建 `lib/`, `components/`, `data/` 等目录
- 如果你使用图标，请克制，尽量用线性风格

文案要求：
- 以中文为主
- 但品牌标题、少量标签、按钮可以用英文，以增强视觉气质
- 不要写传统营销页文案，要更像工作台 / 档案系统 / 实验室面板

请按以下顺序输出并落地代码：
1. 项目目录结构
2. 关键页面与组件说明
3. 完整代码
4. 本地运行方式
5. 后续扩展点

特别提醒：
- 不要重新爬网页
- 不要生成通用紫色 AI SaaS 风格
- 不要把页面做成普通卡片瀑布流
- 要让人一眼看出这是一个非常有设计态度的 Prompt 管理工作台
```
