'use client';

import { useEffect, useState } from 'react';
import { PROMPT_USER_STATE_DEFAULT, PROMPT_USER_STATE_KEYS, sanitizePromptUserState, type PromptUserState } from '../lib/promptUserState';

function createDeviceId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `device-${Math.random().toString(36).slice(2)}-${Date.now()}`;
}

function readLocalState() {
  if (typeof window === 'undefined') {
    return PROMPT_USER_STATE_DEFAULT;
  }

  try {
    return sanitizePromptUserState({
      favorites: JSON.parse(localStorage.getItem(PROMPT_USER_STATE_KEYS.favorites) || '[]'),
      ratings: JSON.parse(localStorage.getItem(PROMPT_USER_STATE_KEYS.ratings) || '{}'),
      usageCounts: JSON.parse(localStorage.getItem(PROMPT_USER_STATE_KEYS.usageCounts) || '{}'),
    });
  } catch {
    return PROMPT_USER_STATE_DEFAULT;
  }
}

function persistLocalState(state: PromptUserState) {
  if (typeof window === 'undefined') return;

  localStorage.setItem(PROMPT_USER_STATE_KEYS.favorites, JSON.stringify(state.favorites));
  localStorage.setItem(PROMPT_USER_STATE_KEYS.ratings, JSON.stringify(state.ratings));
  localStorage.setItem(PROMPT_USER_STATE_KEYS.usageCounts, JSON.stringify(state.usageCounts));
}

export function usePersistentPromptState() {
  const [state, setState] = useState<PromptUserState>(PROMPT_USER_STATE_DEFAULT);
  const [isLoaded, setIsLoaded] = useState(false);
  const [syncSource] = useState<'local'>('local');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const localState = readLocalState();
    setState(localState);

    let stableDeviceId = localStorage.getItem(PROMPT_USER_STATE_KEYS.deviceId);
    if (!stableDeviceId) {
      stableDeviceId = createDeviceId();
      localStorage.setItem(PROMPT_USER_STATE_KEYS.deviceId, stableDeviceId);
    }

    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !isLoaded) return;

    persistLocalState(state);
  }, [isLoaded, state]);

  return {
    favorites: state.favorites,
    ratings: state.ratings,
    usageCounts: state.usageCounts,
    isLoaded,
    syncSource,
    toggleFavorite(id: string) {
      setState((current) => {
        const nextState = {
          ...current,
          favorites: current.favorites.includes(id)
            ? current.favorites.filter((item) => item !== id)
            : [...current.favorites, id],
        };
        persistLocalState(nextState);
        return nextState;
      });
    },
    setRating(id: string, rating: number) {
      setState((current) => {
        const nextState = {
          ...current,
          ratings: {
            ...current.ratings,
            [id]: rating,
          },
        };
        persistLocalState(nextState);
        return nextState;
      });
    },
    recordUsage(id: string) {
      setState((current) => {
        const nextState = {
          ...current,
          usageCounts: {
            ...current.usageCounts,
            [id]: (current.usageCounts[id] || 0) + 1,
          },
        };
        persistLocalState(nextState);
        return nextState;
      });
    },
  };
}
