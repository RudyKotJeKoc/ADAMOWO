import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { useRedFlagsStore } from './redflags.store';

const STORAGE_KEY = 'community-redflags';

const resetStore = () => {
  useRedFlagsStore.setState({ entries: [] });
  localStorage.removeItem(STORAGE_KEY);
};

describe('red flags store', () => {
  beforeEach(() => {
    resetStore();
  });

  afterEach(() => {
    resetStore();
  });

  it('creates a new entry with trimmed note', () => {
    const created = useRedFlagsStore.getState().addEntry({
      date: '2024-05-01',
      category: 'gaslighting',
      intensity: 4,
      note: '  test  '
    });

    expect(created).not.toBeNull();
    const entries = useRedFlagsStore.getState().entries;
    expect(entries).toHaveLength(1);
    expect(entries[0]?.note).toBe('test');
  });

  it('removes entries by id', () => {
    const store = useRedFlagsStore.getState();
    const created = store.addEntry({ date: '2024-01-01', category: 'discard', intensity: 2 });
    expect(created).not.toBeNull();

    useRedFlagsStore.getState().removeEntry(created!.id);
    expect(useRedFlagsStore.getState().entries).toHaveLength(0);
  });

  it('persists entries to localStorage', () => {
    const { addEntry } = useRedFlagsStore.getState();
    addEntry({ date: '2024-02-10', category: 'emotional_blackmail', intensity: 5, note: 'Test notatki' });
    const stored = localStorage.getItem(STORAGE_KEY);
    expect(stored).toBeTruthy();
    expect(stored).toContain('Test notatki');
  });
});
