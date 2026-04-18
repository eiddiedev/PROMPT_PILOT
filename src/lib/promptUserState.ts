export type PromptUserState = {
  favorites: string[];
  ratings: Record<string, number>;
  usageCounts: Record<string, number>;
};

export const PROMPT_USER_STATE_DEFAULT: PromptUserState = {
  favorites: [],
  ratings: {},
  usageCounts: {},
};

export const PROMPT_USER_STATE_KEYS = {
  deviceId: 'promptPilot.deviceId',
  favorites: 'favorites',
  ratings: 'promptRatings',
  usageCounts: 'promptUsage',
};

export function sanitizePromptUserState(input?: Partial<PromptUserState> | null): PromptUserState {
  return {
    favorites: Array.isArray(input?.favorites)
      ? input!.favorites.filter((item): item is string => typeof item === 'string')
      : [],
    ratings: isRecord(input?.ratings) ? normalizeNumberRecord(input!.ratings as Record<string, unknown>) : {},
    usageCounts: isRecord(input?.usageCounts) ? normalizeNumberRecord(input!.usageCounts as Record<string, unknown>) : {},
  };
}

export function hasPromptUserStateValue(state: PromptUserState) {
  return (
    state.favorites.length > 0 ||
    Object.keys(state.ratings).length > 0 ||
    Object.keys(state.usageCounts).length > 0
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function normalizeNumberRecord(input: Record<string, unknown>): Record<string, number> {
  return Object.fromEntries(
    Object.entries(input).filter(([, value]) => typeof value === 'number' && Number.isFinite(value)),
  ) as Record<string, number>;
}
