import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getTotalVisits, getVisitsByPath, trackPageVisit } from './analytics';

describe('local analytics API', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('fetches the total visit count', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValue(new Response(JSON.stringify({ ok: true, visits: 42 }), { status: 200 }))
    );
    await expect(getTotalVisits()).resolves.toBe(42);
    expect(fetch).toHaveBeenCalledWith(
      '/api/v1/visits.php',
      expect.objectContaining({ method: 'GET' })
    );
  });

  it('encodes a path when fetching its count', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValue(new Response(JSON.stringify({ ok: true, visits: 3 }), { status: 200 }))
    );
    await expect(getVisitsByPath('/ważna strona')).resolves.toBe(3);
    expect(fetch).toHaveBeenCalledWith(
      '/api/v1/visits.php?path=%2Fwa%C5%BCna%20strona',
      expect.objectContaining({ method: 'GET' })
    );
  });

  it('records a visit with a persistent session ID', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValue(new Response(JSON.stringify({ ok: true, visits: 1 }), { status: 201 }))
    );
    vi.spyOn(crypto, 'randomUUID').mockReturnValue('11111111-1111-4111-8111-111111111111');
    await trackPageVisit('/');

    const options = vi.mocked(fetch).mock.calls[0][1] as RequestInit;
    expect(JSON.parse(options.body as string)).toMatchObject({
      path: '/',
      session_id: '11111111-1111-4111-8111-111111111111',
    });
  });

  it('rejects an API error instead of displaying a fake zero', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response(JSON.stringify({ ok: false }), { status: 500 }))
    );
    await expect(getTotalVisits()).rejects.toThrow('HTTP 500');
  });
});
