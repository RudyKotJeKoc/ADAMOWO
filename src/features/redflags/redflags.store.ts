import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import type { CreateRedFlagInput, RedFlagEntry } from './redflags.schema';

const FALLBACK_STORAGE: Storage = {
  getItem: () => null,
  setItem: () => undefined,
  removeItem: () => undefined,
  clear: () => undefined,
  key: () => null,
  get length() {
    return 0;
  }
};

const storage = createJSONStorage(() => {
  if (typeof window === 'undefined') {
    return FALLBACK_STORAGE;
  }

  try {
    return window.localStorage;
  } catch (error) {
    console.warn('Unable to access localStorage for red flags store', error);
    return FALLBACK_STORAGE;
  }
});

export type RedFlagsState = {
  entries: RedFlagEntry[];
  addEntry: (input: CreateRedFlagInput) => RedFlagEntry | null;
  removeEntry: (id: string) => void;
  clear: () => void;
};

const createEntry = ({ date, category, intensity, note }: CreateRedFlagInput): RedFlagEntry => {
  if (!date) {
    throw new Error('date is required');
  }

  if (note && note.length > 500) {
    throw new Error('note must be <= 500 characters');
  }

  const id = typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

  return {
    id,
    date,
    category,
    intensity,
    note: note?.trim() || undefined,
    createdAt: new Date().toISOString()
  };
};

export const useRedFlagsStore = create<RedFlagsState>()(
  persist(
    (set) => ({
      entries: [],
      addEntry: (input) => {
        try {
          const entry = createEntry(input);
          set((state) => ({ entries: [...state.entries, entry] }));
          return entry;
        } catch (error) {
          console.warn('Failed to add red flag entry', error);
          return null;
        }
      },
      removeEntry: (id) =>
        set((state) => ({ entries: state.entries.filter((entry) => entry.id !== id) })),
      clear: () => set({ entries: [] })
    }),
    {
      name: 'community-redflags',
      storage,
      partialize: (state) => ({ entries: state.entries })
    }
  )
);
