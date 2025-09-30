import { useEffect, useState } from 'react';

import { getEpisodes } from '../analysis-archive/api';
import type { Episode } from '../analysis-archive/data.schema';
import type { ProgramId } from './studio.schema';

type UseRecentEpisodesOptions = {
  limit?: number;
};

type UseRecentEpisodesState = {
  episodes: Episode[];
  isLoading: boolean;
  error: Error | null;
};

const INITIAL_STATE: UseRecentEpisodesState = {
  episodes: [],
  isLoading: false,
  error: null
};

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
