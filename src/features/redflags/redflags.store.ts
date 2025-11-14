import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import type { CreateRedFlagInput, RedFlagEntry } from './redflags.schema';

/**
 * No-op storage implementation for SSR environments.
 *
 * @internal
 */
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

/**
 * Safe localStorage accessor with SSR fallback.
 *
 * Returns FALLBACK_STORAGE during server-side rendering or if
 * localStorage is unavailable.
 *
 * @internal
 */
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

/**
 * State shape and actions for the red flags store.
 *
 * @property entries - Array of all recorded red flag entries
 * @property addEntry - Create and add a new red flag entry
 * @property removeEntry - Delete an entry by ID
 * @property clear - Remove all entries
 */
export type RedFlagsState = {
  entries: RedFlagEntry[];
  addEntry: (input: CreateRedFlagInput) => RedFlagEntry | null;
  removeEntry: (id: string) => void;
  clear: () => void;
};

/**
 * Creates a validated red flag entry.
 *
 * Validates input data, generates a unique ID, and timestamps the entry.
 * Throws if validation fails.
 *
 * @param input - Red flag creation data
 * @returns Fully formed red flag entry
 * @throws Error if date is missing or note exceeds 500 characters
 *
 * @internal
 */
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

/**
 * Zustand store for red flags tracking feature.
 *
 * Manages a collection of red flag behavior entries with automatic
 * persistence to localStorage. Provides CRUD operations for tracking
 * concerning behavioral patterns over time.
 *
 * State is persisted to localStorage and survives page reloads.
 * Failed operations return null and log warnings without throwing.
 *
 * @example
 * ```tsx
 * function RedFlagForm() {
 *   const addEntry = useRedFlagsStore(state => state.addEntry);
 *   const entries = useRedFlagsStore(state => state.entries);
 *
 *   const handleSubmit = (e) => {
 *     e.preventDefault();
 *     const entry = addEntry({
 *       date: '2025-11-14',
 *       category: 'gaslighting',
 *       intensity: 4,
 *       note: 'Denied saying something I clearly remember'
 *     });
 *
 *     if (entry) {
 *       console.log('Entry created:', entry.id);
 *     }
 *   };
 *
 *   return (
 *     <form onSubmit={handleSubmit}>
 *       <p>Total entries: {entries.length}</p>
 *     </form>
 *   );
 * }
 * ```
 */
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
