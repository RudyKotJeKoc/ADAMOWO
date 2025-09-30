import { vi } from 'vitest';

export type QueryResult<T> = {
  data?: T[] | T | null;
  error?: Error | null;
  count?: number | null;
};

export type QueryResultFactory<T> = (
  builder: QueryBuilderMock<T>
) => QueryResult<T> | Promise<QueryResult<T>>;

export type QueryBuilderMock<T> = ReturnType<typeof createQueryBuilderMock<T>>;

function normalizeResult<T>(result: QueryResult<T> | undefined): Required<QueryResult<T>> {
  return {
    data: (result?.data ?? null) as QueryResult<T>['data'],
    error: result?.error ?? null,
    count: result?.count ?? null
  };
}

type ChainableMock<T> = {
  select: ReturnType<typeof vi.fn<[], ChainableMock<T>>>;
  order: ReturnType<typeof vi.fn<[string, { ascending: boolean }?], ChainableMock<T>>>;
  limit: ReturnType<typeof vi.fn<[number], ChainableMock<T>>>;
  range: ReturnType<typeof vi.fn<[number, number], ChainableMock<T>>>;
  in: ReturnType<typeof vi.fn<[string, unknown[]], ChainableMock<T>>>;
  contains: ReturnType<typeof vi.fn<[string, unknown], ChainableMock<T>>>;
  or: ReturnType<typeof vi.fn<[string], ChainableMock<T>>>;
  then: PromiseLike<Required<QueryResult<T>>>['then'];
  catch: PromiseLike<Required<QueryResult<T>>>['catch'];
  finally: PromiseLike<Required<QueryResult<T>>>['finally'];
};

export function createQueryBuilderMock<T>(
  result: QueryResult<T> | QueryResultFactory<T>
): QueryBuilderMock<T> {
  const getResult = typeof result === 'function' ? (result as QueryResultFactory<T>) : () => result;

  const builder = {} as ChainableMock<T>;

  const resolveResult = async () => {
    const value = await getResult(builder as QueryBuilderMock<T>);
    return normalizeResult<T>(value);
  };

  builder.select = vi.fn(() => builder);
  builder.order = vi.fn(() => builder);
  builder.limit = vi.fn(() => builder);
  builder.range = vi.fn(() => builder);
  builder.in = vi.fn(() => builder);
  builder.contains = vi.fn(() => builder);
  builder.or = vi.fn(() => builder);

  builder.then = (
    onFulfilled: (value: Required<QueryResult<T>>) => unknown,
    onRejected?: (reason: unknown) => unknown
  ) => resolveResult().then(onFulfilled, onRejected);
  builder.catch = (onRejected: (reason: unknown) => unknown) => resolveResult().catch(onRejected);
  builder.finally = (onFinally: () => unknown) => resolveResult().finally(onFinally);

  return builder as QueryBuilderMock<T>;
}

export function createRealtimeChannelMock<TPayload = unknown>() {
  const listeners: Array<(payload: TPayload) => void> = [];

  const channel = {
    on: vi.fn(
      (_event: string, _filter: Record<string, unknown>, callback: (payload: TPayload) => void) => {
        listeners.push(callback);
        return channel;
      }
    ),
    subscribe: vi.fn(() => Promise.resolve({})),
    unsubscribe: vi.fn(() => Promise.resolve()),
    emit: (payload: TPayload) => {
      for (const listener of listeners) {
        listener(payload);
      }
    }
  };

  return channel;
}

type TableEntry = QueryBuilderMock<unknown> | (() => QueryBuilderMock<unknown>);

type SupabaseClientMock = {
  from: ReturnType<typeof vi.fn<[string], QueryBuilderMock<unknown>>>;
  channel: ReturnType<typeof vi.fn<[], ReturnType<typeof createRealtimeChannelMock>>>;
  removeChannel: ReturnType<typeof vi.fn<[ReturnType<typeof createRealtimeChannelMock>], Promise<void>>>;
};

export function createSupabaseClientMock(tables: Record<string, TableEntry> = {}): SupabaseClientMock {
  const client = {} as SupabaseClientMock;

  client.from = vi.fn((table: string) => {
    const entry = tables[table];
    if (!entry) {
      throw new Error(`No mock defined for table "${table}"`);
    }
    return typeof entry === 'function' ? (entry as () => QueryBuilderMock<unknown>)() : entry;
  });
  client.channel = vi.fn(() => createRealtimeChannelMock());
  client.removeChannel = vi.fn(async () => {
    /* noop */
  });

  return client;
}
