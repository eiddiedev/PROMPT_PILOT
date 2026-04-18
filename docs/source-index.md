# Prompt 来源索引

整理日期：2026-04-18  
整理原则：只把公开可访问网页作为“灵感来源与分类依据”，项目内种子 Prompt 全部做了统一化改写，避免直接堆砌网上的原始长 Prompt。

## 已使用来源

1. Browser Use `awesome-prompts`
- URL: https://github.com/browser-use/awesome-prompts/blob/main/README.md
- 用途：提取了 `Academic Research`、`Interview Preparation`、`Resume Tailoring`、`Website Functionality Testing` 等结构化 Prompt 思路。
- 用在项目中：学习笔记、面试准备、调试流程、社区推荐卡片。

2. Sankyn `awesome-chatgpt-prompts` README
- URL: https://github.com/sankyn1/awesome-chatgpt-prompts
- 用途：确认其仓库确实按 `Coding`、`Education` 等维度组织 Prompt。
- 用在项目中：帮助确定社区导入区的分类组织方式。

3. Sankyn `code-review-prompt.txt`
- URL: https://github.com/sankyn1/awesome-chatgpt-prompts/blob/main/coding-prompts/code-review-prompt.txt
- 用途：参考“代码质量 / 最佳实践 / 性能 / 安全 / 建议”的输出框架。
- 用在项目中：改写为 `Bug 根因定位助手` 与社区中的结构化代码审查卡片。

4. Sankyn `curriculam-designer-prompt.txt`
- URL: https://github.com/sankyn1/awesome-chatgpt-prompts/blob/main/education-prompts/curriculam-designer-prompt.txt
- 用途：参考“阶段式课程设计 + 练习 + 资源 + capstone”结构。
- 用在项目中：改写为 `技术学习路线图生成器`。

5. GitHub `awesome-copilot`
- URL: https://github.com/github/awesome-copilot
- 用途：参考面向开发者工作流的 Prompt / instruction / skill 组织方式。
- 用在项目中：作为产品“可导入 Prompt 来源”的可信示例，也帮助定义开发者风格的社区模块。

6. GitHub Docs `Storing prompts in repositories`
- URL: https://docs.github.com/en/github-models/use-github-models/storing-prompts-in-github-repositories
- 用途：参考 Prompt 文件可以像代码资产一样被版本化管理。
- 用在项目中：帮助定义产品里的 `source`, `shareSlug`, `version`, `favorite` 等心智模型。

7. Harish Garg `gemini-cli-prompt-library`
- URL: https://github.com/harish-garg/gemini-cli-prompt-library
- 用途：补充了 `design-api`、`refactor`、`generate-unit-tests`、`trace-issue`、`performance-profile`、`edge-cases`、`explain-concept`、`compare-tech` 等高结构化模板。
- 用在项目中：扩充了代码生成、调试、学习三类 Prompt 种子和社区精选。

8. Awesome GitHub Copilot `autoresearch`
- URL: https://github.com/github/awesome-copilot/blob/main/skills/autoresearch/SKILL.md
- 用途：参考“先定指标、建立 baseline、按实验循环迭代”的工作流。
- 用在项目中：改写成 `自主实验学习器`，适合学习性能优化、Prompt 优化和小规模实验。

9. Awesome GitHub Copilot `webapp-testing`
- URL: https://github.com/github/awesome-copilot/blob/main/skills/webapp-testing/SKILL.md
- 用途：参考真实浏览器验证、截图、日志与用户流程检查的测试视角。
- 用在项目中：继续强化调试与验证类 Prompt 的结构设计依据。

10. `Gemini AI Mock Interview` Gist
- URL: https://gist.github.com/Vetrivel-VP/9f54bc244c92ae3f6c53b5c2336cb975
- 用途：参考“根据岗位信息输出严格 JSON 问答数组”的面试准备模板。
- 用在项目中：改写成 `岗位定制 Q&A 生成器`。

11. `Prompt for ChatGPT as an Interviewer` Gist
- URL: https://gist.github.com/VladF12/a84b4806465193ba78296f11f1cced48
- 用途：参考交互式面试官、逐题追问、根据候选人回答动态调整的流程。
- 用在项目中：改写成 `交互式技术面试官` 和对应社区精选。

12. `AI-Assisted Leetcode Prompt` Gist
- URL: https://gist.github.com/jsjoeio/00c5f5fde8acbcf68a4d7007bbfed2e0
- 用途：参考“先解题，再切换成面试官追问”的双阶段练习方式。
- 用在项目中：改写成 `算法题讲解追问官`。

13. `prompts.chat` / `f/awesome-chatgpt-prompts`
- URL: https://github.com/f/awesome-chatgpt-prompts
- 说明：这是 prompts.chat 的开源仓库，README 明确说明 Prompt 数据来自 prompts.chat，同步提供 `PROMPTS.md` 与 `prompts.csv`。
- 许可证：`CC0-1.0`
- 用途：补充了大规模社区 Prompt 来源，重点参考了 `Code Reviewer`、`Teacher of React.js`、`Fullstack Software Developer`、`Reverse Prompt Engineer`、`Job Interviewer` 等开发与学习相关条目。
- 用在项目中：新增了代码生成、调试、学习、面试四类 Prompt 条目与社区精选。

## 建议如何在产品里展示来源

- `Official`：你内置的精选 Prompt
- `Imported`：从 GitHub / JSON / LangSmith 导入
- `Community`：用户上传或公开精选
- `Personal`：用户自建或优化后保存

## 不建议在 MVP 里直接做的事

- 不要现场依赖网页抓取生成全部列表，稳定性太差
- 不要直接照搬公开仓库里很长的原始 Prompt 文本
- 不要做复杂登录、审核、评论链路

## 这次已落到本地的内容

- Prompt 种子数据：[promptSeeds.ts](/Users/a1234/Documents/hackerthon/seed/promptSeeds.ts)
- UI 风格说明：[ui-style-spec.md](/Users/a1234/Documents/hackerthon/docs/ui-style-spec.md)
- TraeSolo 新版生成提示词：[traesolo-prompt-v2.md](/Users/a1234/Documents/hackerthon/docs/traesolo-prompt-v2.md)

## 当前扩充结果

- `promptSeeds` 已从首版扩充到更完整的开发者场景集合
- 新增方向包括：
  - API 设计
  - 重构建议
  - 单元测试生成
  - 根因追踪
  - 性能分析
  - 边界条件识别
  - 概念分层讲解
  - 技术选型对比
  - 交互式面试官
  - 算法题追问训练
  - prompts.chat 社区来源 Prompt
