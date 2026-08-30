/** A single page visit accepted by the local analytics API. */
export interface PageVisit {
  path: string;
  referrer?: string;
  session_id: string;
}

const ANALYTICS_ENDPOINT = '/api/v1/visits.php';
const VISIT_COUNT_EVENT = 'adamowo:visit-count';
const SESSION_KEY = 'adamowo_session_id';

interface AnalyticsResponse {
  ok: boolean;
  visits: number;
}

function getSessionId(): string {
  let sessionId = localStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
}

async function parseResponse(response: Response): Promise<AnalyticsResponse> {
  if (!response.ok) throw new Error(`Analytics API returned HTTP ${response.status}`);

  const data = (await response.json()) as Partial<AnalyticsResponse>;
  if (data.ok !== true || typeof data.visits !== 'number' || data.visits < 0) {
    throw new Error('Analytics API returned an invalid response');
  }
  return data as AnalyticsResponse;
}

/** Records a page visit and publishes the updated count to mounted counters. */
export async function trackPageVisit(path: string): Promise<void> {
  const visit: PageVisit = {
    path,
    referrer: document.referrer || undefined,
    session_id: getSessionId(),
  };
  const response = await fetch(ANALYTICS_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(visit),
    credentials: 'same-origin',
  });
  const data = await parseResponse(response);
  window.dispatchEvent(new CustomEvent<number>(VISIT_COUNT_EVENT, { detail: data.visits }));
}

/** Fetches the total visit count from the local Synology API. */
export async function getTotalVisits(): Promise<number> {
  const response = await fetch(ANALYTICS_ENDPOINT, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    credentials: 'same-origin',
    cache: 'no-store',
  });
  return (await parseResponse(response)).visits;
}

/** Fetches the visit count for one URL path. */
export async function getVisitsByPath(path: string): Promise<number> {
  const response = await fetch(`${ANALYTICS_ENDPOINT}?path=${encodeURIComponent(path)}`, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    credentials: 'same-origin',
    cache: 'no-store',
  });
  return (await parseResponse(response)).visits;
}

/** Subscribes to counts returned after successful page tracking. */
export function subscribeToVisitCount(listener: (visits: number) => void): () => void {
  const handler = (event: Event) => listener((event as CustomEvent<number>).detail);
  window.addEventListener(VISIT_COUNT_EVENT, handler);
  return () => window.removeEventListener(VISIT_COUNT_EVENT, handler);
}
