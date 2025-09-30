import { act, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, beforeEach } from 'vitest';

import { eightSinsModules } from './guide.data';
import { useGuideProgress } from './useGuideProgress';

const TestHarness = () => {
  const { totals, setAnswer, reset } = useGuideProgress(eightSinsModules.slice(0, 1));
  return (
    <div>
      <span data-testid="score">{totals.sin_1 ?? 0}</span>
      <button type="button" onClick={() => setAnswer('sin_1', 'sin_1_q_1', true)}>
        answer
      </button>
      <button type="button" onClick={() => reset()}>reset</button>
    </div>
  );
};

describe('useGuideProgress', () => {
  const storageKey = 'ra.guide.v1';

  beforeEach(() => {
    window.localStorage.clear();
  });

  it('persists answers and updates totals', async () => {
    render(<TestHarness />);

    expect(screen.getByTestId('score').textContent).toBe('0');

    await act(async () => {
      screen.getByText('answer').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('score').textContent).toBe('2');
    });

    const stored = window.localStorage.getItem(storageKey);
    expect(stored).not.toBeNull();
    expect(stored && JSON.parse(stored).totals.sin_1).toBe(2);
  });

  it('restores persisted totals on mount and clears after reset', async () => {
    window.localStorage.setItem(
      storageKey,
      JSON.stringify({
        version: 1,
        answersByModule: { sin_1: { sin_1_q_1: true } },
        totals: { sin_1: 2 },
        updatedAt: new Date().toISOString()
      })
    );

    render(<TestHarness />);

    await waitFor(() => {
      expect(screen.getByTestId('score').textContent).toBe('2');
    });

    await act(async () => {
      screen.getByText('reset').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('score').textContent).toBe('0');
      expect(window.localStorage.getItem(storageKey)).toBeNull();
    });
  });
});
