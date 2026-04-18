import { NextResponse } from 'next/server';
import { promptSeeds } from '../../../../seed/promptSeeds';
import { buildPromptMatch } from '../../../lib/promptInsights';
import { callDeepSeekJson } from '../../../lib/deepseek';

type MatchResponse = {
  summary: string;
  cards: Array<{
    id: string;
    reason: string;
    bestFor: string[];
    tradeoff: string;
    matchedSignals: string[];
  }>;
  source: 'deepseek' | 'local';
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const requirement = typeof body?.requirement === 'string' ? body.requirement.trim() : '';

    if (!requirement) {
      return NextResponse.json({ error: 'requirement is required' }, { status: 400 });
    }

    const rankedMatches = promptSeeds
      .map((prompt) => ({
        ...prompt,
        ...buildPromptMatch(prompt, requirement),
      }))
      .sort((a, b) => b.score - a.score);
    type RankedMatch = (typeof rankedMatches)[number];

    const topCandidates = rankedMatches.slice(0, 6).map((item) => ({
      id: item.id,
      title: item.title,
      category: item.category,
      summary: item.summary,
      scenario: item.scenario,
      tags: item.tags,
      score: item.score,
      reason: item.reason,
      bestFor: item.bestFor,
      tradeoff: item.tradeoff,
      matchedSignals: item.matchedSignals,
      dna: item.dna,
    }));

    try {
      const aiResult = await callDeepSeekJson<{
        summary: string;
        cards: Array<{
          id: string;
          reason: string;
          bestFor: string[];
          tradeoff: string;
          matchedSignals: string[];
        }>;
      }>({
        systemPrompt:
          'You are an expert prompt analyst for an AI coding workflow product. Always return valid JSON. Keep the recommendation concise, concrete, and decision-oriented.',
        userPrompt: [
          '请基于用户需求，从候选 Prompt 中选出最适合的 3 个，并重新组织为 JSON。',
          '输出 JSON 结构必须是：',
          '{"summary":"string","cards":[{"id":"string","reason":"string","bestFor":["string"],"tradeoff":"string","matchedSignals":["string"]}]}',
          '要求：',
          '1. cards 只能使用候选里的 id。',
          '2. bestFor 最多 3 个短标签。',
          '3. reason 必须解释为什么适合当前需求。',
          '4. tradeoff 必须诚实说明局限。',
          '5. matchedSignals 最多 4 个。',
          '',
          `用户需求：${requirement}`,
          '',
          `候选 Prompt：${JSON.stringify(topCandidates, null, 2)}`,
        ].join('\n'),
        maxTokens: 1600,
      });

      const mergedCards = aiResult.cards
        .map((card) => {
          const local = rankedMatches.find((item) => item.id === card.id);
          if (!local) return null;

          return {
            ...local,
            reason: card.reason || local.reason,
            bestFor: Array.isArray(card.bestFor) && card.bestFor.length > 0 ? card.bestFor.slice(0, 3) : local.bestFor,
            tradeoff: card.tradeoff || local.tradeoff,
            matchedSignals:
              Array.isArray(card.matchedSignals) && card.matchedSignals.length > 0
                ? card.matchedSignals.slice(0, 4)
                : local.matchedSignals,
          };
        })
        .filter((item): item is RankedMatch => item !== null);

      if (mergedCards.length > 0) {
        const topCard = mergedCards[0];
        const response: MatchResponse = {
          summary: aiResult.summary || `最适合当前需求的是「${topCard.title}」，因为它与任务目标和输出约束最贴近。`,
          cards: mergedCards,
          source: 'deepseek',
        };

        return NextResponse.json(response);
      }
    } catch (error) {
      console.error('DeepSeek match failed, falling back to local analysis:', error);
    }

    const fallbackCards = rankedMatches.slice(0, 3).map((item) => ({
      id: item.id,
      reason: item.reason,
      bestFor: item.bestFor,
      tradeoff: item.tradeoff,
      matchedSignals: item.matchedSignals,
    }));

    const fallbackResponse: MatchResponse = {
      summary: `最适合当前需求的是「${rankedMatches[0].title}」，因为它最贴近你的任务类型，并且在结构性与复用性上更适合直接进入执行。`,
      cards: fallbackCards,
      source: 'local',
    };

    return NextResponse.json(fallbackResponse);
  } catch (error) {
    console.error('Match API failed:', error);
    return NextResponse.json({ error: 'match analysis failed' }, { status: 500 });
  }
}
