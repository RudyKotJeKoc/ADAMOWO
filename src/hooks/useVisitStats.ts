import { useState, useEffect } from 'react';
import { getTotalVisits, getVisitsByPath } from '../lib/analytics';

/**
 * Hook to fetch and display total visit count
 */
export function useTotalVisits() {
  const [visits, setVisits] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetchVisits() {
      try {
        setLoading(true);
        const count = await getTotalVisits();
        if (mounted) {
          setVisits(count);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Failed to fetch visits'));
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchVisits();

    return () => {
      mounted = false;
    };
  }, []);

  return { visits, loading, error };
}

/**
 * Hook to fetch visit count for a specific path
 */
export function usePathVisits(path: string) {
  const [visits, setVisits] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetchVisits() {
      try {
        setLoading(true);
        const count = await getVisitsByPath(path);
        if (mounted) {
          setVisits(count);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Failed to fetch visits'));
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchVisits();

    return () => {
      mounted = false;
    };
  }, [path]);

  return { visits, loading, error };
}
