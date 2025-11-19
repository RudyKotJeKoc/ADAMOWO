import { useEffect, useState } from 'react';

import { getEpisodes } from '../analysis-archive/api';
import type { Episode } from '../analysis-archive/data.schema';
import type { ProgramId } from './studio.schema';

/**
 * Configuration options for useRecentEpisodes hook.
 *
 * @property limit - Maximum number of episodes to fetch (default 5)
 *
 * @internal
 */
type UseRecentEpisodesOptions = {
  limit?: number;
};

/**
 * Internal state structure for the hook.
 *
 * @property episodes - Fetched episode data
 * @property isLoading - True while API request is in flight
 * @property error - Error object if request failed, null otherwise
 *
 * @internal
 */
type UseRecentEpisodesState = {
  episodes: Episode[];
  isLoading: boolean;
  error: Error | null;
};

/**
 * Initial state before any data is loaded.
 *
 * @internal
 */
const INITIAL_STATE: UseRecentEpisodesState = {
  episodes: [],
  isLoading: false,
  error: null
};

/**
 * Fetches recent episodes for a studio program.
 *
 * Provides:
 * - Automatic loading state management
 * - Error handling
 * - Cleanup on unmount/programId change
 * - Configurable result limit
 *
 * The hook automatically refetches when programId or limit changes.
 * Returns empty array with no loading state when programId is null.
 *
 * @param programId - Program to fetch episodes for (null to skip fetching)
 * @param options - Configuration options (limit defaults to 5)
 * @returns State object with episodes, loading flag, and error
 *
 * @example
 * ```tsx
 * import { useRecentEpisodes } from './useRecentEpisodes';
 *
 * function ProgramEpisodes({ programId }: { programId: ProgramId }) {
 *   const { episodes, isLoading, error } = useRecentEpisodes(programId, { limit: 10 });
 *
 *   if (isLoading) return <div>Loading episodes...</div>;
 *   if (error) return <div>Error: {error.message}</div>;
 *
 *   return (
 *     <ul>
 *       {episodes.map((episode) => (
 *         <li key={episode.id}>{episode.title}</li>
 *       ))}
 *     </ul>
 *   );
 * }
 *
 * // With custom limit
 * function TopThreeEpisodes({ programId }: { programId: ProgramId }) {
 *   const { episodes } = useRecentEpisodes(programId, { limit: 3 });
 *   return <div>{episodes.length} recent episodes</div>;
 * }
 *
 * // Conditional fetching
 * function ConditionalFetch({ programId }: { programId: ProgramId | null }) {
 *   const { episodes } = useRecentEpisodes(programId);
 *   // No fetch happens when programId is null
 *   return <div>{episodes.length} episodes</div>;
 * }
 * ```
 */
export function useRecentEpisodes(programId: ProgramId | null | undefined, options: UseRecentEpisodesOptions = {}) {
  const [state, setState] = useState<UseRecentEpisodesState>(INITIAL_STATE);

  useEffect(() => {
    if (!programId) {
      setState({ episodes: [], isLoading: false, error: null });
      return;
    }

    let cancelled = false;
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    const limit = Number.isFinite(options.limit) && options.limit ? options.limit : 5;

    const load = async () => {
      try {
        const result = await getEpisodes({
          programId,
          sort: 'newest',
          page: 1,
          pageSize: limit
        });

        if (cancelled) {
          return;
        }

        setState({ episodes: result.episodes, isLoading: false, error: null });
      } catch (error) {
        if (cancelled) {
          return;
        }

        setState({ episodes: [], isLoading: false, error: error as Error });
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [programId, options.limit]);

  return state;
}
