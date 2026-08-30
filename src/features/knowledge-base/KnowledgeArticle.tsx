import {
  ArrowLeftIcon,
  ArrowTopRightOnSquareIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { Link, useParams } from 'react-router-dom';

import { knowledgeBySlug, KNOWLEDGE_REVIEW_DATE } from './knowledge.data';
import { CATEGORY_LABELS, KIND_LABELS } from './knowledge.types';

export default function KnowledgeArticle(): JSX.Element {
  const { slug = '' } = useParams();
  const entry = knowledgeBySlug.get(slug);

  if (!entry) {
    return (
      <section className="mx-auto max-w-3xl rounded-3xl border border-base-800 bg-base-900/60 p-8 text-center sm:p-12">
        <h1 className="text-3xl font-bold text-base-50">Nie znaleziono tego pojęcia</h1>
        <p className="mt-3 text-base-300">Adres mógł się zmienić albo wpis nie istnieje.</p>
        <Link
          to="/definicje"
          className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-accent-500 px-5 py-3 font-semibold text-base-950 hover:bg-accent-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-300"
        >
          <ArrowLeftIcon className="h-4 w-4" aria-hidden="true" /> Wróć do definicji
        </Link>
      </section>
    );
  }

  const related = (entry.related ?? [])
    .map((relatedSlug) => knowledgeBySlug.get(relatedSlug))
    .filter(Boolean);

  return (
    <article className="mx-auto w-full max-w-4xl space-y-8">
      <Link
        to="/definicje"
        className="inline-flex min-h-11 items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-base-300 hover:bg-base-900 hover:text-accent-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
      >
        <ArrowLeftIcon className="h-4 w-4" aria-hidden="true" /> Wszystkie definicje
      </Link>

      <header className="rounded-3xl border border-base-800 bg-gradient-to-br from-base-900 to-base-950 p-6 sm:p-10">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full border border-accent-500/30 bg-accent-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent-200">
            {KIND_LABELS[entry.kind]}
          </span>
          <span className="rounded-full border border-base-700 bg-base-800/70 px-3 py-1 text-xs text-base-300">
            {CATEGORY_LABELS[entry.category]}
          </span>
        </div>
        <h1 className="mt-5 text-3xl font-bold leading-tight text-base-50 sm:text-5xl">
          {entry.title}
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-base-200">{entry.summary}</p>
      </header>

      {entry.caution ? (
        <aside className="flex gap-3 rounded-2xl border border-accent-500/30 bg-accent-500/5 p-5 text-sm leading-relaxed text-base-200">
          <ExclamationTriangleIcon
            className="mt-0.5 h-5 w-5 shrink-0 text-accent-300"
            aria-hidden="true"
          />
          <p>
            <strong className="text-accent-200">Granica pojęcia:</strong> {entry.caution}
          </p>
        </aside>
      ) : null}

      <section
        aria-labelledby="explanation-title"
        className="rounded-2xl border border-base-800 bg-base-900/50 p-6 sm:p-8"
      >
        <h2 id="explanation-title" className="text-2xl font-bold text-base-50">
          Co to znaczy?
        </h2>
        <div className="mt-4 space-y-4 text-base leading-7 text-base-200">
          {entry.explanation.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section
        aria-labelledby="remember-title"
        className="rounded-2xl border border-base-800 bg-base-900/50 p-6 sm:p-8"
      >
        <h2 id="remember-title" className="text-2xl font-bold text-base-50">
          Co warto sprawdzić?
        </h2>
        <ul className="mt-4 space-y-3">
          {entry.remember.map((item) => (
            <li key={item} className="flex gap-3 text-base-200">
              <CheckCircleIcon
                className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300"
                aria-hidden="true"
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {entry.legalBasis?.length ? (
        <section
          aria-labelledby="basis-title"
          className="rounded-2xl border border-base-800 bg-base-900/50 p-6 sm:p-8"
        >
          <h2 id="basis-title" className="text-2xl font-bold text-base-50">
            Podstawa i punkty odniesienia
          </h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-base-200">
            {entry.legalBasis.map((basis) => (
              <li key={basis}>{basis}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {entry.sources?.length ? (
        <section
          aria-labelledby="sources-title"
          className="rounded-2xl border border-base-800 bg-base-900/50 p-6 sm:p-8"
        >
          <h2 id="sources-title" className="text-2xl font-bold text-base-50">
            Źródła urzędowe i zawodowe
          </h2>
          <ul className="mt-4 space-y-3">
            {entry.sources.map((source) => (
              <li key={source.url}>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-11 items-center gap-2 rounded-xl px-3 py-2 text-accent-300 underline decoration-accent-500/40 underline-offset-4 hover:bg-base-800 hover:text-accent-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
                >
                  {source.label}
                  <ArrowTopRightOnSquareIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {related.length > 0 ? (
        <section aria-labelledby="related-title" className="space-y-4">
          <h2 id="related-title" className="text-2xl font-bold text-base-50">
            Powiązane pojęcia
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {related.map((item) =>
              item ? (
                <Link
                  key={item.slug}
                  to={`/definicje/${item.slug}`}
                  className="rounded-2xl border border-base-800 bg-base-900/60 p-5 font-semibold text-base-100 transition hover:border-accent-500/50 hover:text-accent-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
                >
                  {item.title}
                </Link>
              ) : null
            )}
          </div>
        </section>
      ) : null}

      <footer className="rounded-2xl border border-base-800 bg-base-900/40 p-5 text-sm leading-relaxed text-base-400">
        Opracowanie edukacyjne. Stan przeglądu źródeł: {KNOWLEDGE_REVIEW_DATE}. Nie opisuje
        indywidualnej sprawy i nie zastępuje porady profesjonalisty.
      </footer>
    </article>
  );
}
