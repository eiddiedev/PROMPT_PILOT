export type PromptCategory = "codegen" | "debug" | "study" | "interview" | "product" | "research" | "creative";

export type PromptSeed = {
  id: string;
  title: string;
  category: PromptCategory;
  summary: string;
  scenario: string;
  tags: string[];
  prompt: string;
  sourceLabel: string;
  sourceUrl: string;
  adaptationNote: string;
};

export type CommunitySpotlight = {
  id: string;
  title: string;
  category: PromptCategory;
  recommendedFor: string;
  comparisonSummary: string;
  highlight: string;
  sourceLabel: string;
  sourceUrl: string;
};

// These prompts are adapted into a consistent product format for hackathon use.
export const promptSeeds: PromptSeed[] = [
  {
    id: "codegen-spec-to-mvp",
    title: "功能描述到 MVP 脚手架",
    category: "codegen",
    summary: "把产品需求快速转成最小可运行代码结构，适合黑客松起步。",
    scenario: "给 Trae / Copilot / Claude 一段产品描述，快速生成页面、组件、状态和假数据。",
    tags: ["MVP", "Scaffold", "Next.js", "Hackathon"],
    prompt: `你现在是一名资深全栈工程师，请把下面的产品需求转成一个最小可运行的 MVP 实现方案，并直接输出可编码的结果。

目标：
1. 优先保证能运行，不做过度架构
2. 只实现核心闭环，砍掉非必要边缘功能
3. 输出时按“页面结构 -> 组件清单 -> 状态设计 -> 假数据 -> 开发顺序”组织

要求：
- 技术栈固定为：Next.js + TypeScript + Tailwind
- 如果没有后端，就使用本地 mock data 或 localStorage
- 为每个页面明确主操作、空状态、加载状态
- 先给出目录结构，再给核心代码
- 如果需求过大，请主动压缩为 3 小时内可完成的版本，并说明保留了哪些亮点

需求如下：
{{product_brief}}`,
    sourceLabel: "Browser Use Awesome Prompts + Sankyn Coding Prompts",
    sourceUrl: "https://github.com/browser-use/awesome-prompts/blob/main/README.md",
    adaptationNote: "结合多步任务拆解与开发类 Prompt 结构，重写为适合黑客松落地的中文代码生成模板。",
  },
  {
    id: "codegen-ui-component-builder",
    title: "高约束 UI 组件生成器",
    category: "codegen",
    summary: "在给定视觉语言、状态和交互约束下生成单个高质量组件。",
    scenario: "适合首页主卡、详情面板、搜索区、对比模块等关键组件。",
    tags: ["UI", "Component", "States", "Tailwind"],
    prompt: `请基于下面的设计约束实现一个高质量 React 组件。

组件名称：{{component_name}}
用途：{{component_goal}}

必须满足：
1. 使用 TypeScript + Tailwind
2. 明确支持默认、悬停、选中、禁用、空状态
3. 组件 API 尽量精简，但要有可复用性
4. 不要只写静态外观，要把信息层级和交互意图写出来
5. 如果组件包含数据展示，请给一份贴近产品场景的 mock props

视觉约束：
{{visual_rules}}

输出格式：
1. 组件职责说明
2. props 设计
3. 完整代码
4. 使用示例
5. 为什么这样设计`,
    sourceLabel: "GitHub Awesome Copilot patterns",
    sourceUrl: "https://github.com/github/awesome-copilot",
    adaptationNote: "参考开发者代理工作流的结构化输出习惯，重写为单组件生成 Prompt。",
  },
  {
    id: "codegen-api-contract-first",
    title: "先定接口再写前端",
    category: "codegen",
    summary: "先把实体、状态和接口约定清楚，减少返工。",
    scenario: "适合社区模块、收藏、优化记录等需要类型稳定的区域。",
    tags: ["API", "Types", "Schema", "Frontend"],
    prompt: `你要先做产品建模，而不是立刻写页面。

请根据以下需求先输出：
1. 核心实体与字段定义
2. 前端需要的 TypeScript 类型
3. API 路由草案
4. localStorage / mock data 兼容结构
5. 组件读写这些数据的推荐方式

规则：
- 字段只保留 MVP 真正需要的
- 优先支持前端快速联调
- 每个实体都给一个示例 JSON
- 若需求里有“收藏、复制、分享、优化历史”，要考虑它们之间的关联关系

需求如下：
{{feature_brief}}`,
    sourceLabel: "GitHub Models prompt file guidance",
    sourceUrl: "https://docs.github.com/en/github-models/use-github-models/storing-prompts-in-github-repositories",
    adaptationNote: "结合提示模板管理思路，重写为面向 MVP 数据建模的接口设计 Prompt。",
  },
  {
    id: "debug-root-cause-triage",
    title: "Bug 根因定位助手",
    category: "debug",
    summary: "把报错、上下文和可能原因整理成可执行排查路径。",
    scenario: "适合生成代码后报错、样式异常、状态错乱、接口不通等问题。",
    tags: ["Debug", "Logs", "Root Cause", "Triage"],
    prompt: `你是一名冷静而严格的调试工程师。请根据我提供的报错、相关代码和预期行为，输出一份高质量排查结论。

输出必须包含：
1. 问题摘要
2. 最可能的 3 个根因，按概率排序
3. 每个根因对应的验证步骤
4. 最小修复方案
5. 修复后应补充的测试或防回归措施

调试规则：
- 不要泛泛而谈
- 优先指出具体文件、状态流、依赖关系、空值、边界条件
- 如果信息不够，请明确写出“缺失信息清单”
- 如果有多个问题交织，请拆成主问题和次问题

上下文如下：
报错信息：
{{error_log}}

相关代码：
{{code_snippet}}

预期行为：
{{expected_behavior}}`,
    sourceLabel: "Sankyn Code Review Prompt",
    sourceUrl: "https://github.com/sankyn1/awesome-chatgpt-prompts/blob/main/coding-prompts/code-review-prompt.txt",
    adaptationNote: "保留结构化、可执行、具体反馈的优点，改写为偏调试排障场景。",
  },
  {
    id: "debug-regression-fix",
    title: "回归问题修复器",
    category: "debug",
    summary: "当功能之前能用、现在坏了时，帮助快速锁定回归点。",
    scenario: "适合黑客松中快速堆功能后出现的连带破坏。",
    tags: ["Regression", "Compare", "Fix", "QA"],
    prompt: `请以“回归问题定位”的方式分析这个问题。

我会提供：
- 之前正常的行为
- 现在异常的行为
- 最近改动的代码或思路

请输出：
1. 最可能受影响的模块
2. 这次改动可能破坏了什么约束
3. 应该优先比对的状态、props、依赖、DOM 结构或数据字段
4. 一次最小回滚式修复方案
5. 更稳妥的最终修复方案

要求：
- 黑客松语境下优先选择低风险、快验证的修复
- 如果适合先加保护分支、默认值、fallback，也请明确写出

正常行为：
{{before}}

异常行为：
{{after}}

最近改动：
{{recent_changes}}`,
    sourceLabel: "Browser Use QA sections",
    sourceUrl: "https://github.com/browser-use/awesome-prompts/blob/main/README.md",
    adaptationNote: "从测试与用户流程检查的结构出发，重写为回归修复 Prompt。",
  },
  {
    id: "debug-test-first",
    title: "先构造复现再修复",
    category: "debug",
    summary: "要求模型先写最小复现条件，再给修复，减少拍脑袋改代码。",
    scenario: "适合难复现的边界错误和状态同步问题。",
    tags: ["Repro", "Test", "Fix", "Edge Case"],
    prompt: `不要直接给我修复代码。先按下面顺序工作：

1. 根据现象推导最小复现步骤
2. 写出需要验证的输入、状态和边界条件
3. 指出最可能失败的断言
4. 给出最小修复代码
5. 补一条最关键的测试思路

请特别关注：
- undefined / null
- 空数组 / 空结果
- 异步状态覆盖
- 条件渲染导致的 UI 抖动
- 浏览器端与服务端状态不一致

现象：
{{bug_description}}

上下文代码：
{{code_context}}`,
    sourceLabel: "Browser Use Website Functionality Testing",
    sourceUrl: "https://github.com/browser-use/awesome-prompts/blob/main/README.md",
    adaptationNote: "借鉴测试用例与预期行为拆解方式，改写为先复现后修复的调试 Prompt。",
  },
  {
    id: "study-learning-roadmap",
    title: "技术学习路线图生成器",
    category: "study",
    summary: "把零散学习目标整理成阶段化路线图与练习计划。",
    scenario: "适合“我三周内学会 Next.js / 算法 / Prompt Engineering”。",
    tags: ["Roadmap", "Learning", "Curriculum", "Practice"],
    prompt: `请作为一名懂实战的技术导师，为我制定一份阶段化学习路线图。

主题：{{topic}}
我的基础：{{current_level}}
目标时间：{{timeline}}
最终目标：{{target_outcome}}

输出结构：
1. Beginner / Intermediate / Advanced 三阶段
2. 每阶段列出：
   - 要学什么
   - 为什么重要
   - 推荐练习
   - 一个可展示的小项目
3. 每周学习节奏建议
4. 常见误区与避坑提醒
5. 最终 capstone 项目

要求：
- 尽量贴近开发者真实工作流
- 少讲定义，多讲应用
- 让我能照着直接执行`,
    sourceLabel: "Sankyn Curriculum Designer Prompt",
    sourceUrl: "https://github.com/sankyn1/awesome-chatgpt-prompts/blob/main/education-prompts/curriculam-designer-prompt.txt",
    adaptationNote: "基于课程设计 Prompt 的框架，重写为开发者友好的学习路线模板。",
  },
  {
    id: "study-paper-to-notes",
    title: "论文与资料精读笔记",
    category: "study",
    summary: "把论文、长文或教程快速压缩成结构化学习笔记。",
    scenario: "适合 AI、前端、系统设计等资料学习后沉淀知识。",
    tags: ["Notes", "Research", "Summary", "Knowledge Base"],
    prompt: `请把下面的文章 / 论文 / 文档内容整理成一份高质量学习笔记。

输出结构：
1. 一句话总结
2. 核心观点 3-5 条
3. 关键术语解释
4. 作者是如何论证的
5. 我作为开发者最值得带走的实践启发
6. 如果我要继续深入，接下来应该看什么

风格要求：
- 不要只是摘要
- 要体现“我为什么要学它”
- 如果内容里有方法论，请拆成步骤
- 如果有实验、案例或对比，请单独标出

原文如下：
{{source_text}}`,
    sourceLabel: "Browser Use Academic Research",
    sourceUrl: "https://github.com/browser-use/awesome-prompts/blob/main/README.md",
    adaptationNote: "参考学术研究采集 Prompt 的结构，改写为学习笔记产出模板。",
  },
  {
    id: "study-socratic-code-mentor",
    title: "苏格拉底式代码导师",
    category: "study",
    summary: "不直接给答案，而是引导理解代码与思路。",
    scenario: "适合初学者理解陌生代码、框架概念和设计取舍。",
    tags: ["Mentor", "Code Reading", "Socratic", "Teaching"],
    prompt: `请扮演一名耐心的代码导师，不要立刻把答案全部告诉我，而是引导我理解。

任务：
1. 先用非常简洁的话解释这段代码想解决什么问题
2. 再拆解关键部分：数据流、状态、函数职责、依赖关系
3. 提出 3 个引导问题，帮助我自己发现设计意图
4. 最后给出一版“面向初学者”的总结

规则：
- 避免故作高深
- 遇到抽象概念请举一个贴近现实的小例子
- 如果存在更简单写法，也请说明为什么当前写法更常见或更合理

代码如下：
{{code_snippet}}`,
    sourceLabel: "Awesome GitHub Copilot Skills",
    sourceUrl: "https://github.github.com/awesome-copilot/skills/",
    adaptationNote: "参考开发者教学型技能触发场景，重写为中文 Socratic 代码学习 Prompt。",
  },
  {
    id: "interview-role-sim",
    title: "岗位定制模拟面试",
    category: "interview",
    summary: "根据岗位与公司背景生成成体系的模拟面试问题和回答策略。",
    scenario: "适合前端、全栈、算法、Prompt Engineer、AI 产品岗位。",
    tags: ["Interview", "Roleplay", "Technical", "Behavioral"],
    prompt: `请作为一名资深面试官，为我模拟一场高质量面试。

岗位：{{job_title}}
公司：{{company_name}}
我的背景：{{candidate_background}}

请输出：
1. 公司与岗位可能关注的能力点
2. 5 个高频通用问题
3. 5 个岗位技术问题
4. 3 个行为面试问题
5. 每个问题的优秀回答思路
6. 我可以反问面试官的 5 个问题

要求：
- 问题不要太泛
- 回答思路要具体到结构，而不是一句套话
- 如果岗位偏 AI/开发工具，请额外加入项目拆解和落地能力判断`,
    sourceLabel: "Browser Use Interview Preparation",
    sourceUrl: "https://github.com/browser-use/awesome-prompts/blob/main/README.md",
    adaptationNote: "基于岗位研究和问答准备的公开模板，重写为更适合中文技术岗位的模拟面试 Prompt。",
  },
  {
    id: "interview-resume-tailor",
    title: "简历定制优化器",
    category: "interview",
    summary: "把现有简历针对目标 JD 做关键词、项目表述与亮点提炼。",
    scenario: "适合投递前快速优化简历和项目描述。",
    tags: ["Resume", "JD Match", "ATS", "Project Bullets"],
    prompt: `请根据目标岗位描述，帮我把现有简历改得更匹配。

你需要输出：
1. JD 里的关键词与能力要求
2. 我的简历里已经覆盖的部分
3. 明显缺失或表达不够强的部分
4. 改写后的个人简介
5. 改写后的项目经历 bullet points
6. ATS 友好的关键词建议

要求：
- 不要虚构经历
- 优先优化表达方式、成果量化和技术关键词
- 对每一段修改说明“为什么这样改”

岗位描述：
{{job_description}}

当前简历：
{{resume_text}}`,
    sourceLabel: "Browser Use Resume Tailoring",
    sourceUrl: "https://github.com/browser-use/awesome-prompts/blob/main/README.md",
    adaptationNote: "沿用 JD 提炼与简历匹配思路，重写为适合技术求职者的中文简历优化模板。",
  },
  {
    id: "interview-star-story-coach",
    title: "STAR 项目故事打磨器",
    category: "interview",
    summary: "把零散项目经历整理成可讲、可追问、可量化的 STAR 回答。",
    scenario: "适合行为面试、项目讲述、领导力或冲突处理类问题。",
    tags: ["STAR", "Behavioral", "Storytelling", "Leadership"],
    prompt: `请把我的项目经历改写成适合面试表达的 STAR 故事。

原始素材：
{{raw_story}}

请输出：
1. Situation：背景要交代哪些信息
2. Task：我的任务与约束是什么
3. Action：我具体做了哪些关键动作
4. Result：结果如何量化
5. 面试官可能继续追问的 5 个问题
6. 我应该避免的空话和薄弱点

要求：
- 不要夸大
- 尽量保留具体决策和取舍
- 结果部分优先写用户价值、效率提升、质量改善或业务影响`,
    sourceLabel: "Browser Use Interview Preparation",
    sourceUrl: "https://github.com/browser-use/awesome-prompts/blob/main/README.md",
    adaptationNote: "从行为问题准备逻辑延展而来，重写为 STAR 叙事强化 Prompt。",
  },
  {
    id: "codegen-rest-api-designer",
    title: "REST API 设计器",
    category: "codegen",
    summary: "把业务需求快速转成资源、路由、请求响应和错误模型。",
    scenario: "适合功能上线前先把接口面梳清，尤其是社区、收藏、优化记录、分享等模块。",
    tags: ["REST", "API", "Schema", "Backend Contract"],
    prompt: `请根据下面的业务需求，设计一套最小可运行但足够清晰的 REST API。

输出必须包含：
1. 核心资源与它们之间的关系
2. 路由列表（方法 + 路径 + 用途）
3. 请求参数与响应结构
4. 分页、筛选、排序方案
5. 常见错误码与错误返回格式
6. 适合前端快速联调的示例 JSON

要求：
- URL 用资源名，不要写成动词接口
- 优先满足 MVP，不做超前设计
- 如果需求存在权限差异，请说明哪些接口属于游客、登录用户、管理员
- 如果适合拆成主资源和子资源，请解释原因

业务需求：
{{product_requirement}}`,
    sourceLabel: "Gemini CLI Prompt Library - design-api",
    sourceUrl: "https://github.com/harish-garg/gemini-cli-prompt-library/blob/main/commands/architecture/design-api.toml",
    adaptationNote: "基于 RESTful API 设计模板，改写为更适合前后端联调与黑客松 MVP 的中文接口设计 Prompt。",
  },
  {
    id: "codegen-refactor-plan",
    title: "重构路线建议器",
    category: "codegen",
    summary: "把一段能跑但杂乱的代码整理成有优先级的重构清单。",
    scenario: "适合黑客松后半段收口、准备演示前快速提升代码可读性。",
    tags: ["Refactor", "Maintainability", "Code Smells", "Architecture"],
    prompt: `请把下面这段代码当作“需要安全重构的现有实现”，输出一份高质量的重构路线。

输出结构：
1. 高优先级重构项
2. 中优先级改进项
3. 低优先级整理项
4. 最值得先提取的方法 / 组件 / 模块
5. 命名改进建议
6. 如果要分步骤落地，推荐的安全重构顺序
7. 每一步开始前建议补哪些测试

重点检查：
- 长函数
- 重复逻辑
- 条件分支过深
- 命名不清
- 组件职责过多
- 模块耦合
- 可以用 guard clause 或提取函数简化的地方

代码如下：
{{code_snippet}}`,
    sourceLabel: "Gemini CLI Prompt Library - refactor",
    sourceUrl: "https://github.com/harish-garg/gemini-cli-prompt-library/blob/main/commands/code-review/refactor.toml",
    adaptationNote: "基于代码重构模板，改写为适合前端和全栈项目快速收口的中文 Prompt。",
  },
  {
    id: "codegen-unit-test-builder",
    title: "单元测试套件生成器",
    category: "codegen",
    summary: "根据函数或模块自动规划 happy path、边界条件和异常路径测试。",
    scenario: "适合给关键工具函数、优化逻辑和状态处理模块快速补测试。",
    tags: ["Tests", "Jest", "Vitest", "Coverage"],
    prompt: `请为下面的代码生成一套完整、可运行的单元测试。

输出要求：
1. 自动选择合适的测试框架风格（优先 Jest / Vitest）
2. 至少覆盖：
   - 正常路径
   - 边界条件
   - 无效输入
   - 异常处理
3. 如果存在依赖项，请明确哪些地方需要 mock
4. 测试命名要表达“什么条件下得到什么结果”
5. 最后补一段“哪些逻辑仍值得再加集成测试”

请优先考虑这些输入问题：
- null / undefined
- 空字符串 / 空数组
- 极值
- 类型不符
- off-by-one

代码如下：
{{code_under_test}}`,
    sourceLabel: "Gemini CLI Prompt Library - generate-unit-tests",
    sourceUrl: "https://github.com/harish-garg/gemini-cli-prompt-library/blob/main/commands/testing/generate-unit-tests.toml",
    adaptationNote: "基于测试生成模板，重写为更适合开发者直接复制使用的中文单测 Prompt。",
  },
  {
    id: "debug-trace-issue",
    title: "五个为什么根因追踪器",
    category: "debug",
    summary: "把症状、时间线、假设和证据组织成系统化根因分析。",
    scenario: "适合线上故障、偶发异常、接口超时、登录失败、功能突然退化等复杂问题。",
    tags: ["5 Whys", "Root Cause", "Timeline", "Hypothesis"],
    prompt: `请对下面这个问题做一次系统化根因分析，不要只给一个猜测。

输出必须包含：
1. 问题定义：预期、实际、影响范围、严重程度
2. 现有症状与已知证据
3. 最近改动与时间线推断
4. 用“五个为什么”逐层追问
5. 至少 3 个可能根因，并说明各自证据与概率
6. 最小复现建议
7. 下一步验证实验
8. 最终最可能根因与修复建议

如果信息不足，请单独列出“还缺什么信息才能确认”。

问题描述：
{{issue_description}}`,
    sourceLabel: "Gemini CLI Prompt Library - trace-issue",
    sourceUrl: "https://github.com/harish-garg/gemini-cli-prompt-library/blob/main/commands/debugging/trace-issue.toml",
    adaptationNote: "基于根因分析模板，改写为适合工程问题调查的中文 Prompt。",
  },
  {
    id: "debug-performance-profiler",
    title: "性能瓶颈分析器",
    category: "debug",
    summary: "帮助识别前端或后端性能问题的关键指标、瓶颈位置和优化顺序。",
    scenario: "适合页面卡顿、加载慢、接口延迟高、CPU 飙升、内存增长等问题。",
    tags: ["Performance", "Profiling", "Metrics", "Optimization"],
    prompt: `请对下面的性能问题做一次面向工程落地的分析，而不是泛泛列建议。

输出结构：
1. 应该先采集哪些关键指标
2. 最可能的瓶颈类别（算法 / I/O / 网络 / 渲染 / 数据库 / 内存）
3. 每个瓶颈的验证手段
4. 最可能优先优化的 3 个点
5. 如果是前端，建议用哪些 DevTools 面板看什么
6. 如果是后端，建议用哪些 profiling 或日志策略
7. 优化优先级与预期收益

问题背景：
{{performance_problem}}

当前上下文：
{{performance_context}}`,
    sourceLabel: "Gemini CLI Prompt Library - performance-profile",
    sourceUrl: "https://github.com/harish-garg/gemini-cli-prompt-library/blob/main/commands/debugging/performance-profile.toml",
    adaptationNote: "基于性能 profiling 模板，压缩成更适合产品和工程团队立即执行的中文 Prompt。",
  },
  {
    id: "debug-edge-case-hunter",
    title: "边界条件猎手",
    category: "debug",
    summary: "系统枚举输入、状态、时间、平台和依赖相关的隐藏边界情况。",
    scenario: "适合表单、排序、分页、日期处理、金额计算、状态切换等容易埋雷的功能。",
    tags: ["Edge Cases", "Validation", "Robustness", "QA"],
    prompt: `请为下面的功能或代码系统性识别边界条件，并按“最容易出 bug 的优先级”整理。

输出至少包含：
1. 输入边界
2. 类型错误
3. 空值与缺失字段
4. 并发 / 顺序问题
5. 时间与日期问题
6. 外部依赖失败
7. 平台差异
8. 最值得优先补的测试案例

请特别关注：
- 0、负数、极大值
- 空数组、空字符串、undefined、null
- 不同浏览器 / 时区 / 语言环境
- 重复点击、重复提交、回退重试

功能或代码如下：
{{feature_or_code}}`,
    sourceLabel: "Gemini CLI Prompt Library - edge-cases",
    sourceUrl: "https://github.com/harish-garg/gemini-cli-prompt-library/blob/main/commands/testing/edge-cases.toml",
    adaptationNote: "基于边界条件枚举模板，改写为更适合功能测试与缺陷预防的中文 Prompt。",
  },
  {
    id: "study-concept-explainer",
    title: "概念分层讲解器",
    category: "study",
    summary: "把技术概念从 ELI5 到工程实践分层讲清楚，并补例子和常见误区。",
    scenario: "适合学习框架机制、系统设计概念、算法思想和 AI 原理。",
    tags: ["Explain", "ELI5", "Concept", "Examples"],
    prompt: `请把下面这个技术概念讲清楚，但要分层讲，不要一上来就堆术语。

输出结构：
1. 一句话直觉解释
2. ELI5 版本
3. 面向初学者的正式解释
4. 面向工程师的深入解释
5. 代码示例
6. 常见误解
7. 与相似概念的区别
8. 真正工作里什么时候会遇到它
9. 3 个常见面试问法

概念如下：
{{concept_name}}`,
    sourceLabel: "Gemini CLI Prompt Library - explain-concept",
    sourceUrl: "https://github.com/harish-garg/gemini-cli-prompt-library/blob/main/commands/learning/explain-concept.toml",
    adaptationNote: "基于多层解释模板，改写为更适合开发者学习与复习的中文概念讲解 Prompt。",
  },
  {
    id: "study-tech-comparator",
    title: "技术选型对比器",
    category: "study",
    summary: "对比两种技术的理念、适用场景、生态、性能和学习成本。",
    scenario: "适合 React vs Vue、REST vs GraphQL、Next.js vs Remix 等选型场景。",
    tags: ["Compare", "Tradeoffs", "Decision", "Tech Stack"],
    prompt: `请从工程决策角度对比下面两种技术，而不是写成泛泛百科。

输出至少包含：
1. 核心理念差异
2. 学习曲线
3. 开发体验
4. 性能与运行时特征
5. 生态成熟度
6. 招聘市场与团队上手成本
7. 各自更适合的业务场景
8. 如果我是 {{your_context}}，该怎么选

对比对象：
{{tech_a}} vs {{tech_b}}`,
    sourceLabel: "Gemini CLI Prompt Library - compare-tech",
    sourceUrl: "https://github.com/harish-garg/gemini-cli-prompt-library/blob/main/commands/learning/compare-tech.toml",
    adaptationNote: "基于技术比较模板，改写为更强调真实取舍与适用场景的中文 Prompt。",
  },
  {
    id: "study-autonomous-experiment-planner",
    title: "自主实验学习器",
    category: "study",
    summary: "把一个编程目标拆成可测量、可迭代的实验任务。",
    scenario: "适合想用小实验去学性能优化、提示词优化、Agent 行为调参等主题。",
    tags: ["Experiment", "Optimization", "Iteration", "Learning by Doing"],
    prompt: `请把下面这个学习目标，改写成一组可测量、可迭代的小实验。

输出结构：
1. 学习目标如何转成可测量指标
2. 建议记录的 baseline
3. 允许调整的变量
4. 5 轮实验计划，每轮包含：
   - 假设
   - 修改内容
   - 衡量方法
   - 保留 / 放弃标准
5. 最后如何总结实验结论

要求：
- 优先强调“做中学”
- 每轮实验范围不要太大
- 如果学习目标无法量化，请先帮我设计一个近似指标

学习目标：
{{learning_goal}}`,
    sourceLabel: "Awesome GitHub Copilot - autoresearch",
    sourceUrl: "https://github.com/github/awesome-copilot/blob/main/skills/autoresearch/SKILL.md",
    adaptationNote: "参考自主实验循环技能，改写为适合个人学习和 Prompt 优化的中文实验规划 Prompt。",
  },
  {
    id: "interview-json-qna-generator",
    title: "岗位定制 Q&A 生成器",
    category: "interview",
    summary: "根据岗位、JD、年限和技术栈输出结构化技术问答清单。",
    scenario: "适合投递前快速生成一组高相关度的模拟问答题库。",
    tags: ["Interview", "Q&A", "JD", "JSON"],
    prompt: `请根据下面的岗位信息，生成 5 组高质量技术面试问答，并严格按 JSON 数组返回。

每个对象必须包含：
- question
- answer

要求：
- 问题要围绕技术栈、最佳实践、复杂需求处理能力
- 回答要有结构，不要一句空话
- 不要输出解释文字，不要输出 Markdown，只返回 JSON

岗位信息：
- 职位：{{job_position}}
- 岗位描述：{{job_description}}
- 年限要求：{{experience_years}}
- 技术栈：{{tech_stack}}`,
    sourceLabel: "Gemini AI Mock Interview Gist",
    sourceUrl: "https://gist.github.com/Vetrivel-VP/9f54bc244c92ae3f6c53b5c2336cb975",
    adaptationNote: "基于结构化 JSON 面试问答模板，改写为更适合技术岗位准备的中文 Prompt。",
  },
  {
    id: "interview-interviewer-roleplay",
    title: "交互式技术面试官",
    category: "interview",
    summary: "让模型只扮演面试官，按问题逐个推进并根据回答追问。",
    scenario: "适合 Prompt Engineer、前端、全栈、AI 工具岗位的模拟实战。",
    tags: ["Roleplay", "Interviewer", "Follow-up", "Interactive"],
    prompt: `你现在是一名有经验的技术面试官，请只做一件事：像真实面试一样，逐题面我。

规则：
1. 先做简短自我介绍并说明面试目标
2. 只提一个问题，等我回答后再继续
3. 问题必须覆盖：
   - 技术知识
   - 项目经历
   - 场景推理
   - 软技能
4. 根据我的回答做追问
5. 如果我紧张或回答不完整，请鼓励我，但不要直接给答案
6. 结束时再做总结与建议

岗位方向：
{{target_role}}

我的背景：
{{candidate_background}}`,
    sourceLabel: "Prompt Engineer Interviewer Gist",
    sourceUrl: "https://gist.github.com/VladF12/a84b4806465193ba78296f11f1cced48",
    adaptationNote: "基于交互式 interviewer 系统提示，改写为更通用的技术面试模拟 Prompt。",
  },
  {
    id: "interview-leetcode-debrief",
    title: "算法题讲解追问官",
    category: "interview",
    summary: "先让模型解题，再切到面试官模式逐步追问你的解法与复杂度。",
    scenario: "适合刷 LeetCode 后做二次消化，训练表达而不只是训练 AC。",
    tags: ["LeetCode", "DSA", "Follow-up", "Complexity"],
    prompt: `分两步进行：

第一步：
请先用 {{language}} 解答下面这道算法题，并给出清晰代码。

题目：
{{problem_statement}}

第二步：
在你给出答案之后，请立刻切换成面试官模式。

要求：
1. 你只能以面试官身份发言
2. 一次只问一个问题
3. 重点追问：
   - 为什么这样设计
   - 时间复杂度和空间复杂度
   - 边界条件
   - 如果数据量更大怎么办
   - 是否还有更优解
4. 不要一次性把所有问题写完
5. 等我回答后再继续`,
    sourceLabel: "AI-Assisted Leetcode Prompt Gist",
    sourceUrl: "https://gist.github.com/jsjoeio/00c5f5fde8acbcf68a4d7007bbfed2e0",
    adaptationNote: "基于先解题再切 interviewer 的双阶段思路，改写为适合算法面试训练的中文 Prompt。",
  },
  // 产品设计分类
  {
    id: "product-prd-generator",
    title: "PRD 生成器",
    category: "product",
    summary: "根据产品想法快速生成结构化的产品需求文档。",
    scenario: "适合产品经理、创业者快速整理产品思路，生成专业的 PRD 文档。",
    tags: ["PRD", "Product", "Documentation", "Requirements"],
    prompt: `请根据以下产品想法，生成一份结构化的产品需求文档。

产品想法：{{product_idea}}

输出结构：
1. 产品概览
2. 核心功能
3. 用户流程
4. 页面设计
5. 技术实现
6. 运营策略
7. 风险评估

要求：
- 内容要具体，避免空泛描述
- 考虑用户体验和技术可行性
- 提供可落地的建议`,
    sourceLabel: "Product Design Best Practices",
    sourceUrl: "https://github.com/browser-use/awesome-prompts",
    adaptationNote: "基于产品设计最佳实践，重写为适合快速生成 PRD 的中文 Prompt。",
  },
  {
    id: "product-jtbd-prioritizer",
    title: "JTBD 需求优先级分析器",
    category: "product",
    summary: "把一堆需求、抱怨和想法，整理成 Jobs-to-be-Done 视角下的优先级列表。",
    scenario: "适合 feature request 太多、团队意见分散、需要重新抓主线价值的时候。",
    tags: ["JTBD", "Prioritization", "Discovery", "Feature Requests"],
    prompt: `请作为一名有判断力的产品经理，帮我用 Jobs-to-be-Done 的视角分析下面这些需求与反馈。

请输出：
1. 用户真正想完成的核心任务
2. 每条需求分别解决了哪个 job
3. 哪些只是表层诉求，哪些是底层痛点
4. 优先级建议（High / Medium / Low）
5. 如果只能先做 3 件事，应该做什么以及为什么
6. 哪些需求应该延后、删除或换一种实现方式

要求：
- 不要只复述需求
- 优先判断价值密度和是否贴近真实用户任务
- 如果需求彼此冲突，请指出冲突点
- 最后给一个适合 MVP 的排序结果

输入内容：
{{feature_requests_or_feedback}}`,
    sourceLabel: "Dean Peters Product Manager Prompts",
    sourceUrl: "https://github.com/deanpeters/product-manager-prompts",
    adaptationNote: "参考该仓库围绕 JTBD 与 feature prioritization 的产品管理问题组织方式，改写为适合中文产品讨论的优先级 Prompt。",
  },
  {
    id: "product-positioning-alignment",
    title: "产品定位对齐器",
    category: "product",
    summary: "帮助把一句模糊想法整理成清晰的目标用户、场景、价值和差异化表述。",
    scenario: "适合早期项目、黑客松题目、内部方案评审前快速统一产品定位。",
    tags: ["Positioning", "Messaging", "Strategy", "Alignment"],
    prompt: `请把下面的产品想法，整理成一份团队可共识的产品定位说明。

输出结构：
1. 目标用户是谁
2. 他们当前最痛的场景是什么
3. 我们的产品承诺解决什么问题
4. 与现有替代方案相比的关键差异
5. 一句话定位
6. 面向团队的版本：内部定位说明
7. 面向外部的版本：对外介绍文案

要求：
- 不要写成营销套话
- 要明确“不是给所有人做的”
- 如果产品边界不清，请主动压缩范围
- 最后给一版更适合黑客松 MVP 的简化定位

产品描述：
{{product_brief}}`,
    sourceLabel: "Dean Peters Product Manager Prompts",
    sourceUrl: "https://github.com/deanpeters/product-manager-prompts",
    adaptationNote: "参考该仓库中 positioning statement framework 的问题导向，改写为更适合快速产品对齐的中文 Prompt。",
  },
  {
    id: "product-user-story-backlog-builder",
    title: "用户故事与 Backlog 生成器",
    category: "product",
    summary: "把产品目标拆成按用户流程排序的 user stories、acceptance criteria 和 MVP backlog。",
    scenario: "适合从想法进入开发前，把需求写成工程团队能直接接住的格式。",
    tags: ["User Stories", "Backlog", "Gherkin", "Acceptance Criteria"],
    prompt: `请根据下面的产品描述，为我生成一份按用户流程组织的产品 backlog。

输出必须包含：
1. 高层用户流程列表
2. 按顺序排列的 user stories
3. 每条 story 的用户角色、目标、收益
4. 最关键的 acceptance criteria
5. 如适合，请补充简短 Gherkin 场景
6. 哪些属于 MVP，哪些属于后续版本

要求：
- user story 采用 “As a / I want / so that” 结构
- 优先覆盖端到端主流程
- 避免写成过细的开发任务
- 输出结果要能直接拿去做需求评审

产品描述：
{{product_description}}`,
    sourceLabel: "User Story Examples",
    sourceUrl: "https://github.com/seanrioux/user-story-examples",
    adaptationNote: "参考该仓库中 user stories、Gherkin 与 backlog 的组织方式，改写为更适合产品到工程交接的中文 Prompt。",
  },
  // 研究分析分类
  {
    id: "research-market-analysis",
    title: "市场分析助手",
    category: "research",
    summary: "对特定行业或产品进行全面的市场分析。",
    scenario: "适合创业者、产品经理了解市场现状、竞争格局和机会点。",
    tags: ["Market Analysis", "Research", "Competition", "Trends"],
    prompt: `请对以下行业或产品进行全面的市场分析。

分析对象：{{analysis_target}}

输出内容：
1. 市场规模与增长趋势
2. 主要竞争对手分析
3. 目标用户群体
4. 市场机会点
5. 潜在风险
6. 发展建议

要求：
- 分析要客观全面
- 提供数据支持的结论
- 给出具体的行动建议`,
    sourceLabel: "Market Research Frameworks",
    sourceUrl: "https://github.com/browser-use/awesome-prompts",
    adaptationNote: "基于市场研究框架，重写为适合快速分析市场的中文 Prompt。",
  },
  {
    id: "research-deep-research-brief",
    title: "深度研究总控 Prompt",
    category: "research",
    summary: "把一个研究主题扩写成结构化、可验证、可继续迭代的深度研究任务书。",
    scenario: "适合调研一个新赛道、新技术或新市场时，先把研究边界和输出结构定清楚。",
    tags: ["Deep Research", "Brief", "Structured Output", "Evidence"],
    prompt: `请围绕下面的研究主题，生成一份高质量深度研究任务书。

输出必须包含：
1. 研究目标与核心问题
2. 研究范围与不研究的内容
3. 需要重点查证的数据与证据类型
4. 研究步骤拆解
5. 最终输出格式
6. 如何标记不确定信息与待验证点

要求：
- 优先使用权威英文资料进行检索，但用中文输出
- 对所有重要判断给出证据类型建议
- 不要把多个大问题混成一团
- 结尾给一个适合 AI 执行的最终研究 Prompt

研究主题：
{{research_topic}}`,
    sourceLabel: "Awesome Deep Research Prompts",
    sourceUrl: "https://github.com/langgptai/awesome-deep-research-prompts",
    adaptationNote: "参考该仓库中 deep research、research plan 与 evidence-oriented 写法，改写为适合平台沉淀的中文研究任务 Prompt。",
  },
  {
    id: "research-competitor-teardown",
    title: "竞品拆解与对位分析器",
    category: "research",
    summary: "把竞品官网、定价、定位、产品能力和近期动态整理成一份可对比的结构化报告。",
    scenario: "适合做新项目开题、产品立项、功能差异化判断和答辩材料准备。",
    tags: ["Competitors", "Teardown", "Positioning", "Comparison"],
    prompt: `请对下面的目标公司或产品做一份结构化竞品拆解。

输出内容：
1. 核心定位与目标用户
2. 主要功能与价值主张
3. 定价与商业模式
4. 竞争优势与短板
5. 最近 3 个月的重要动态
6. 和我们相比可借鉴什么、必须避开什么
7. 最终对位建议：我们应该站在哪个差异化位置

要求：
- 尽量基于官网、定价页、新闻或公开资料
- 不要只做表层罗列
- 重点总结“为什么用户会选它”
- 最后给一个对创始人/评委可直接汇报的精简结论

分析对象：
{{competitor_target}}`,
    sourceLabel: "Browser Use Awesome Prompts - Competitor Analysis Extraction",
    sourceUrl: "https://github.com/browser-use/awesome-prompts/blob/main/README.md",
    adaptationNote: "参考其中 competitor analysis extraction 的字段设计，改写为更贴近产品战略对位的中文 Prompt。",
  },
  {
    id: "research-product-market-fit-validator",
    title: "产品市场验证研究员",
    category: "research",
    summary: "围绕一个产品想法系统回答：值不值得做、用户会不会买、利润空间在哪里。",
    scenario: "适合独立开发者、黑客松项目、早期创业想法做 PMF 方向判断。",
    tags: ["PMF", "Validation", "Market Fit", "Indie Hacking"],
    prompt: `请作为一名严谨的产品市场研究员，帮我验证下面这个产品想法是否值得继续投入。

请输出：
1. 目标用户画像
2. 他们真正的痛点与现有替代方案
3. 为什么会买 / 为什么不会买
4. 潜在收入空间与定价区间
5. 可能的运营成本与利润空间
6. 适合去哪里验证需求
7. 最小验证实验建议
8. 最终结论：继续做 / 谨慎验证 / 暂缓

要求：
- 如果证据不充分，要明确标记出来
- 不允许编造数据
- 尽量给出可执行的验证动作，而不只是结论
- 请站在“一个没有预算的独立开发者”视角给建议

产品想法：
{{product_idea}}`,
    sourceLabel: "Product Market Researcher Gist",
    sourceUrl: "https://gist.github.com/iamhenry/1c7673ed2fb1d88c39110e9aab5a3170",
    adaptationNote: "参考该 PMF research prompt 对收入、成本、目标用户与验证步骤的要求，改写为更适合黑客松和独立开发者的中文版本。",
  },
  // 创意生成分类
  {
    id: "creative-content-generator",
    title: "内容创意生成器",
    category: "creative",
    summary: "为不同平台生成创意内容，包括文案、标题、脚本等。",
    scenario: "适合内容创作者、营销人员快速生成创意内容。",
    tags: ["Content", "Creative", "Marketing", "Copywriting"],
    prompt: `请为以下主题生成创意内容。

主题：{{content_topic}}
平台：{{platform}}
目标受众：{{target_audience}}

输出要求：
1. 吸引人的标题
2. 创意文案
3. 内容结构
4. 关键信息点
5. 调用行动

风格要求：
- 符合平台特性
- 吸引目标受众
- 具有创意和独特性`,
    sourceLabel: "Content Marketing Best Practices",
    sourceUrl: "https://github.com/browser-use/awesome-prompts",
    adaptationNote: "基于内容营销最佳实践，重写为适合生成创意内容的中文 Prompt。",
  },
  {
    id: "creative-campaign-concept-lab",
    title: "传播概念实验室",
    category: "creative",
    summary: "围绕受众、品牌和时间节点，一次性产出多组 campaign concept 与 wild card 创意。",
    scenario: "适合黑客松答辩包装、品牌传播概念、产品发布活动、社媒 campaign 设计。",
    tags: ["Campaign", "Concept", "Creative Direction", "Marketing"],
    prompt: `请作为一名懂品牌与传播的创意总监，为下面这个产品生成一组传播创意概念。

输出结构：
1. 5 个主创意概念
2. 1 个 wild card 概念
3. 每个概念包含：
   - 名称
   - 核心洞察
   - 一句话大 idea
   - 适合的传播形式
   - 预期触发的情绪
4. 从中选出最值得执行的 3 个
5. 说明为什么它们更适合传播

要求：
- 概念要有区分度，不要只是换措辞
- 不要只给 slogan，要讲清背后的洞察
- 概念必须能延展成视觉、文案和活动方向
- 如果适合，请额外给一个“非常冒险但可能爆”的 wild card

品牌 / 产品：
{{brand_or_product}}

目标受众：
{{target_audience}}`,
    sourceLabel: "ChatGPT Marketing Prompts - 5 Campaign Concepts, 1 Wild Card",
    sourceUrl: "https://gist.github.com/pogla/418b702ee815b785513bc21c4ff71977",
    adaptationNote: "参考该营销 Prompt 中多概念 + wild card 的组织方式，改写为更适合中文品牌与产品创意的版本。",
  },
  {
    id: "creative-brand-identity-brief",
    title: "品牌识别设计 Brief 生成器",
    category: "creative",
    summary: "把产品定位扩展成品牌名、视觉方向、语气、配色与品牌人格的完整 brief。",
    scenario: "适合项目命名、黑客松品牌包装、Landing Page 视觉方向统一。",
    tags: ["Brand", "Identity", "Naming", "Visual Direction"],
    prompt: `请根据下面的产品信息，生成一份完整的品牌识别设计 brief。

输出必须包含：
1. 品牌名方向（至少 5 个）
2. 品牌人格关键词
3. 视觉风格方向
4. 主色 / 辅色 / 强调色建议
5. 字体与版式建议
6. Logo 概念方向
7. 语气与文案风格
8. 一句品牌主张

要求：
- 不要只给抽象形容词
- 所有建议都要能落实到设计与页面表现
- 命名需要区分科技感、可信度和记忆点
- 最后挑出一套最适合当前产品的组合方案

产品信息：
{{brand_context}}`,
    sourceLabel: "Brand Identity Prompt Gist",
    sourceUrl: "https://gist.github.com/kleneway/3c7364384046349acd22bc9c0d5a0b79",
    adaptationNote: "参考该 brand identity 设计 brief 的字段范围，改写为更适合产品品牌包装的中文 Prompt。",
  },
  {
    id: "creative-divergent-idea-sprint",
    title: "发散式创意冲刺器",
    category: "creative",
    summary: "先大量发散，再分组、筛选、重组，帮助你在短时间内找到更有惊喜感的方向。",
    scenario: "适合卡在命名、功能玩法、传播角度、视觉表达时快速打开发散空间。",
    tags: ["Brainstorming", "Divergence", "Idea Sprint", "Creative Thinking"],
    prompt: `请帮我围绕下面这个创意目标，先做一轮高强度发散，再帮我收敛。

第一阶段：发散
- 先给我 {{idea_count}} 个大胆、意外、甚至有点离谱的想法
- 不要过早优化
- 优先追求多样性和惊喜感

第二阶段：聚类
- 把这些想法归类成 3-5 个方向
- 说明每个方向的共同特征

第三阶段：收敛
- 选出最值得继续推进的 3 个
- 说明为什么
- 给每个方向一个更适合落地的改写版

要求：
- 允许荒诞，但不能完全脱离目标
- 不要只给同一思路的排列组合
- 最后给一个“最保守”版本和一个“最疯狂”版本

创意目标：
{{creative_goal}}`,
    sourceLabel: "Stanford-Inspired Creative Prompt Template",
    sourceUrl: "https://gist.github.com/hall-jm/4a6abfbf08e7d7a220c39056b6a28dc4",
    adaptationNote: "参考该发散优先的 creative template，改写为更适合产品命名、传播和玩法头脑风暴的中文 Prompt。",
  },
  {
    id: "codegen-fullstack-architect",
    title: "全栈方案生成器",
    category: "codegen",
    summary: "根据业务需求快速产出安全、可实现的前后端技术方案与实现骨架。",
    scenario: "适合从需求描述直接进入系统设计与代码骨架生成，尤其适合表单、角色权限、后台管理类产品。",
    tags: ["Fullstack", "Architecture", "JWT", "CRUD"],
    prompt: `请把下面的 Web 应用需求，转换成一套最小但专业的全栈实现方案。

输出必须包含：
1. 技术架构总览
2. 前端模块拆分
3. 后端模块拆分
4. 身份认证与权限设计
5. 数据模型建议
6. 核心接口清单
7. 最小代码骨架或目录结构

要求：
- 优先考虑安全性和可落地性
- 如果涉及角色，请明确不同角色能做什么
- 如果使用 token，请说明登录、续期、权限校验策略
- 不要写成空泛架构图，要能指导实现

需求如下：
{{app_requirement}}`,
    sourceLabel: "prompts.chat - Fullstack Software Developer",
    sourceUrl: "https://github.com/f/awesome-chatgpt-prompts",
    adaptationNote: "参考 prompts.chat 中 Fullstack Software Developer 条目，改写为更通用的中文全栈方案 Prompt。",
  },
  {
    id: "codegen-reverse-prompt-rebuilder",
    title: "反向 Prompt 还原器",
    category: "codegen",
    summary: "根据一段生成结果反推出更可能的原始 Prompt 结构。",
    scenario: "适合分析优秀案例、拆解竞品输出风格，或把好结果沉淀成可复用模板。",
    tags: ["Reverse Prompt", "Prompt Analysis", "Template", "Reconstruction"],
    prompt: `请根据下面这段 AI 生成结果，反推出最可能的原始 Prompt。

输出结构：
1. 还原后的核心 Prompt
2. 这个 Prompt 的 Persona / Context / Task / Constraints / Output Format
3. 你为什么这样推断
4. 如果我要得到更稳定结果，建议补哪些约束

规则：
- 优先输出一个完整、可直接复用的 Prompt
- 如果存在多种可能，请给出最可能的一版和一个备选版本
- 推断时请关注语气、结构、长度、输出格式、是否有角色设定

生成结果如下：
{{model_output}}`,
    sourceLabel: "prompts.chat - Reverse Prompt Engineer",
    sourceUrl: "https://github.com/f/awesome-chatgpt-prompts",
    adaptationNote: "参考 prompts.chat 中 Reverse Prompt Engineer 条目，改写为适合 Prompt 库沉淀的中文版本。",
  },
  {
    id: "debug-code-review-specialist",
    title: "开发者代码审查官",
    category: "debug",
    summary: "根据语言和代码上下文给出问题、建议和可替代实现。",
    scenario: "适合对一段具体代码做快速 review，尤其是找出不稳妥实现和替代方案。",
    tags: ["Code Review", "Suggestions", "Alternatives", "Explain Why"],
    prompt: `请作为一名经验丰富的代码审查工程师，审查下面的代码。

我会提供：
- 代码语言
- 代码片段 / 方法 / 文件

请输出：
1. 主要问题点
2. 可改进建议
3. 更推荐的替代写法
4. 每条建议背后的原因
5. 如果继续演进，这段代码最值得优先改哪一处

要求：
- 不要只说“可以优化”
- 尽量指出具体模式、函数职责、可维护性或性能风险
- 如果当前写法也有优点，请一并说明

代码语言：
{{language}}

代码内容：
{{code_block}}`,
    sourceLabel: "prompts.chat - Code Reviewer",
    sourceUrl: "https://github.com/f/awesome-chatgpt-prompts",
    adaptationNote: "参考 prompts.chat 中 Code Reviewer 条目，改写为更结构化、适合 Prompt 平台展示的中文版本。",
  },
  {
    id: "study-react-learning-table",
    title: "React 学习课表生成器",
    category: "study",
    summary: "用主题、学习方式、练习任务三列把 React 学习路径拆清楚。",
    scenario: "适合从零开始学 React，也适合给初学者生成结构化学习计划。",
    tags: ["React", "Learning", "Roadmap", "Assignments"],
    prompt: `请作为我的 React 导师，为我生成一份从零开始的 React 学习课表。

要求输出为表格，至少包含三列：
1. 主题
2. 每个主题应该学什么、怎么学
3. 对应练习或作业

要求：
- 面向初学者
- 从基础到进阶递进
- 覆盖 JSX、组件、props、state、事件、hooks、路由、异步数据、性能优化
- 每个阶段都要有小项目练习

我的背景：
{{current_level}}

我的目标：
{{goal}}`,
    sourceLabel: "prompts.chat - Teacher of React.js",
    sourceUrl: "https://github.com/f/awesome-chatgpt-prompts",
    adaptationNote: "参考 prompts.chat 中 Teacher of React.js 条目，改写为更适合中文开发者学习的结构化 Prompt。",
  },
  {
    id: "study-software-dev-mentor",
    title: "软件开发导师",
    category: "study",
    summary: "站在资深工程师视角，讲解实现思路、取舍、排错和成长路径。",
    scenario: "适合理解陌生项目、补足工程化思维、从‘会写代码’过渡到‘会做产品’。",
    tags: ["Mentor", "Software Engineering", "Best Practices", "Growth"],
    prompt: `请扮演一名资深软件开发导师，帮助我从工程实践角度理解和改进下面的问题。

请输出：
1. 这件事的核心目标
2. 应该优先考虑的工程约束
3. 推荐实现思路
4. 常见踩坑点
5. 如何判断自己真的掌握了
6. 如果我是初级工程师，下一步应该练什么

任务或问题如下：
{{problem_or_task}}`,
    sourceLabel: "prompts.chat - Knowledgeable Software Development Mentor",
    sourceUrl: "https://github.com/f/awesome-chatgpt-prompts",
    adaptationNote: "参考 prompts.chat 中 Software Development Mentor 类条目，改写为更贴近成长型学习的中文 Prompt。",
  },
  {
    id: "interview-software-job-interviewer",
    title: "软件开发岗位面试官",
    category: "interview",
    summary: "针对软件开发岗位进行一问一答式模拟面试。",
    scenario: "适合前端、后端、全栈、软件工程师岗位做真实感更强的面试训练。",
    tags: ["Interviewer", "Software Developer", "Roleplay", "One by One"],
    prompt: `你现在是一名软件开发岗位面试官，我是候选人。

规则：
1. 岗位默认是：{{position}}
2. 你一次只问一个问题
3. 不要一次性输出整场面试
4. 等我回答后，再根据回答继续追问
5. 不要写解释，不要出戏
6. 优先覆盖：
   - 技术基础
   - 项目经历
   - 调试与排障
   - 协作与取舍

请从自我介绍后的第一个正式问题开始。`,
    sourceLabel: "prompts.chat - Job Interviewer",
    sourceUrl: "https://github.com/f/awesome-chatgpt-prompts",
    adaptationNote: "参考 prompts.chat 中 Job Interviewer 条目，改写为更聚焦软件开发岗位的中文面试 Prompt。",
  },
];

export const communitySpotlights: CommunitySpotlight[] = [
  {
    id: "community-code-review",
    title: "结构化代码审查模板",
    category: "debug",
    recommendedFor: "适合上传代码片段后快速做质量、性能、安全三位一体审查。",
    comparisonSummary: "比普通“帮我看看代码”更稳定，因为输出维度固定，便于做前后 Prompt 对比。",
    highlight: "强调整体总结、代码质量、最佳实践、性能、安全和可执行建议。",
    sourceLabel: "Sankyn Code Review Prompt",
    sourceUrl: "https://github.com/sankyn1/awesome-chatgpt-prompts/blob/main/coding-prompts/code-review-prompt.txt",
  },
  {
    id: "community-learning-roadmap",
    title: "课程式学习路线 Prompt",
    category: "study",
    recommendedFor: "适合学习新技术栈、准备转岗或建立系统性学习计划。",
    comparisonSummary: "比普通“教我 xxx”更强，因为它天然带阶段拆分、练习与 capstone。",
    highlight: "突出 Beginner 到 Advanced 的渐进式结构和实践项目。",
    sourceLabel: "Sankyn Curriculum Designer Prompt",
    sourceUrl: "https://github.com/sankyn1/awesome-chatgpt-prompts/blob/main/education-prompts/curriculam-designer-prompt.txt",
  },
  {
    id: "community-academic-research",
    title: "学术研究资料采集 Prompt",
    category: "study",
    recommendedFor: "适合论文精读、技术调研、趋势汇总。",
    comparisonSummary: "比简单搜索型 Prompt 更好，因为它预设了来源、引用、时间范围和结构化抽取。",
    highlight: "强调论文标题、作者、时间、摘要、引用量和原文链接。",
    sourceLabel: "Browser Use Academic Research",
    sourceUrl: "https://github.com/browser-use/awesome-prompts/blob/main/README.md",
  },
  {
    id: "community-interview-prep",
    title: "公司背景驱动的面试准备",
    category: "interview",
    recommendedFor: "适合正式面试前做公司研究、问题准备和薪资讨论准备。",
    comparisonSummary: "比通用面经更完整，因为它把公司研究、技术题、行为题和反问串成闭环。",
    highlight: "把公司 mission、岗位能力、STAR 故事和薪资讨论放到同一流程。",
    sourceLabel: "Browser Use Interview Preparation",
    sourceUrl: "https://github.com/browser-use/awesome-prompts/blob/main/README.md",
  },
  {
    id: "community-resume-tailoring",
    title: "JD 定制简历优化 Prompt",
    category: "interview",
    recommendedFor: "适合海投前把同一份简历快速改成岗位定制版本。",
    comparisonSummary: "比人工改简历更快，因为能直接抽取关键词、职责与可量化表达。",
    highlight: "强调关键词提取、项目 bullet 改写和 ATS 友好度。",
    sourceLabel: "Browser Use Resume Tailoring",
    sourceUrl: "https://github.com/browser-use/awesome-prompts/blob/main/README.md",
  },
  {
    id: "community-research-compare",
    title: "结构化竞品研究 Prompt",
    category: "study",
    recommendedFor: "适合产品调研、行业扫描、做社区场景推荐。",
    comparisonSummary: "比普通竞品研究更适合接入平台，因为输出天然适合做表格和对比卡片。",
    highlight: "强调统一字段提取和多来源信息对照。",
    sourceLabel: "Browser Use Comparative Research",
    sourceUrl: "https://github.com/browser-use/awesome-prompts/blob/main/README.md",
  },
  {
    id: "community-api-design",
    title: "MVP API 设计 Prompt",
    category: "codegen",
    recommendedFor: "适合先梳理资源、路由和错误格式，再让前后端快速并行开发。",
    comparisonSummary: "比直接让模型“写后端”更稳，因为先锁定接口面和 JSON 结构，后续返工更少。",
    highlight: "突出资源建模、REST 路由、分页筛选和错误返回格式。",
    sourceLabel: "Gemini CLI Prompt Library - design-api",
    sourceUrl: "https://github.com/harish-garg/gemini-cli-prompt-library/blob/main/commands/architecture/design-api.toml",
  },
  {
    id: "community-trace-issue",
    title: "根因追踪 Prompt",
    category: "debug",
    recommendedFor: "适合线上故障、回归 bug、接口异常等需要证据链而不是拍脑袋修复的场景。",
    comparisonSummary: "比普通 debug Prompt 更强，因为它强调时间线、假设、五个为什么和验证实验。",
    highlight: "把症状收集、最近改动、复现路径和最终修复串成闭环。",
    sourceLabel: "Gemini CLI Prompt Library - trace-issue",
    sourceUrl: "https://github.com/harish-garg/gemini-cli-prompt-library/blob/main/commands/debugging/trace-issue.toml",
  },
  {
    id: "community-concept-explainer",
    title: "分层概念讲解 Prompt",
    category: "study",
    recommendedFor: "适合从“我知道这个词”过渡到“我能讲明白并能举例”的学习阶段。",
    comparisonSummary: "比普通解释型 Prompt 更强，因为它天然要求 ELI5、正式解释、代码示例和常见误区。",
    highlight: "覆盖从直觉理解到工程落地的完整认知链。",
    sourceLabel: "Gemini CLI Prompt Library - explain-concept",
    sourceUrl: "https://github.com/harish-garg/gemini-cli-prompt-library/blob/main/commands/learning/explain-concept.toml",
  },
  {
    id: "community-live-interviewer",
    title: "交互式面试官 Prompt",
    category: "interview",
    recommendedFor: "适合做真实感更强的一问一答模拟，而不是一次性刷题单。",
    comparisonSummary: "比静态面经更有压迫感和反馈感，因为它会追问、等待、动态调整问题。",
    highlight: "强调只问一个问题、基于候选人回答继续追问、最后再总结。",
    sourceLabel: "Prompt Engineer Interviewer Gist",
    sourceUrl: "https://gist.github.com/VladF12/a84b4806465193ba78296f11f1cced48",
  },
  {
    id: "community-prompts-chat-code-review",
    title: "prompts.chat 代码审查 Prompt",
    category: "debug",
    recommendedFor: "适合上传指定语言代码后快速获得问题、建议和替代实现。",
    comparisonSummary: "比泛泛 review 更利于落地，因为它强调要解释每条建议背后的原因。",
    highlight: "适合作为社区里“最基础但最高频”的开发者 Prompt 收藏项。",
    sourceLabel: "prompts.chat - Code Reviewer",
    sourceUrl: "https://github.com/f/awesome-chatgpt-prompts",
  },
  {
    id: "community-prompts-chat-react-teacher",
    title: "prompts.chat React 导师 Prompt",
    category: "study",
    recommendedFor: "适合给零基础或转前端用户快速生成表格化学习路线。",
    comparisonSummary: "比普通 roadmap Prompt 更适合教学，因为它天然带主题、学习方式和练习任务三列。",
    highlight: "结构直观，特别适合做学习类 Prompt 平台的热门条目。",
    sourceLabel: "prompts.chat - Teacher of React.js",
    sourceUrl: "https://github.com/f/awesome-chatgpt-prompts",
  },
  {
    id: "community-prompts-chat-fullstack",
    title: "prompts.chat 全栈开发 Prompt",
    category: "codegen",
    recommendedFor: "适合从一句业务需求快速进入系统设计与代码骨架生成。",
    comparisonSummary: "比直接让模型“随便写个系统”更好，因为它先把角色、权限和安全结构带了进来。",
    highlight: "对表单系统、后台管理和角色权限型产品特别实用。",
    sourceLabel: "prompts.chat - Fullstack Software Developer",
    sourceUrl: "https://github.com/f/awesome-chatgpt-prompts",
  },
];
