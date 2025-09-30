import { describe, expect, it } from 'vitest';

import { evaluateMessage } from './rules';

describe('simulator rules', () => {
  it('detects blame shifting pattern', () => {
    const result = evaluateMessage('To wszystko twoja wina.');
    expect(result.rule.id).toBe('blame_shift_your_fault');
    expect(result.techniques).toContain('blame_shift');
  });

  it('falls back to default response when no rule matches', () => {
    const result = evaluateMessage('Dzień dobry, jak się czujesz?');
    expect(result.rule.id).toBe('default');
    expect(result.techniques).toContain('gaslighting');
  });
});
