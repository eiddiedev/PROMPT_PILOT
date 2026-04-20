# Contributing

Thanks for considering a contribution. This project started as a hackathon prototype and is being cleaned up into a maintainable open-source codebase, so small focused improvements are especially helpful.

## Before You Start

- Check existing issues and pull requests to avoid duplicate work.
- Open an issue first for non-trivial changes, architectural changes, or product-direction changes.
- Keep pull requests scoped. Small, reviewable diffs move fastest.

## Local Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

If you do not set `DEEPSEEK_API_KEY`, the app still runs and falls back to local prompt analysis logic.

## Quality Checks

Please run these before opening a pull request:

```bash
npm run lint
npm run test
npm run build
```

## Pull Request Guidelines

- Explain the user-facing problem and the chosen fix.
- Include screenshots or a short recording for UI changes.
- Add or update tests when changing prompt insight or API behavior.
- Avoid unrelated refactors in the same pull request.

## Project Notes

- Prompt source references live in [`docs/source-index.md`](./docs/source-index.md).
- Built-in prompt seeds should stay traceable to their inspiration and adaptation notes.
- Treat the prompt data as curated product content, not a dumping ground for copied raw lists.
