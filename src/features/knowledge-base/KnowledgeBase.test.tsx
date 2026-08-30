import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import KnowledgeArticle from './KnowledgeArticle';
import KnowledgeBase from './KnowledgeBase';
import { knowledgeEntries } from './knowledge.data';

describe('KnowledgeBase', () => {
  it('contains the complete, corrected knowledge catalog', () => {
    expect(knowledgeEntries).toHaveLength(40);
    expect(knowledgeEntries.some((entry) => entry.slug === 'art-234-kk-falszywe-oskarzenie')).toBe(
      true
    );
    expect(
      knowledgeEntries.some((entry) => entry.slug === 'art-238-kk-falszywe-zawiadomienie')
    ).toBe(true);
    expect(
      knowledgeEntries.some((entry) => entry.slug === 'sprzeciw-od-wyroku-nakazowego-art-506-kpk')
    ).toBe(true);
  });

  it('searches the catalog by article, title and tags', () => {
    render(
      <MemoryRouter>
        <KnowledgeBase section="definicje" />
      </MemoryRouter>
    );

    const search = screen.getByRole('searchbox', {
      name: 'Szukaj pojęcia, przepisu lub słowa kluczowego',
    });
    fireEvent.change(search, { target: { value: 'art. 207' } });

    expect(
      screen.getByRole('link', { name: /Art\. 207 k\.k\. — znęcanie się/i })
    ).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /Art\. 888 k\.c\./i })).not.toBeInTheDocument();
  });

  it('shows a clear label for an ADAMOWO analytical model', () => {
    render(
      <MemoryRouter initialEntries={['/definicje/zmowa-korytarzowa']}>
        <Routes>
          <Route path="/definicje/:slug" element={<KnowledgeArticle />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: 'Zmowa korytarzowa' })).toBeInTheDocument();
    expect(screen.getByText('Model analityczny ADAMOWO')).toBeInTheDocument();
    expect(screen.getByText(/nie termin kodeksowy/i)).toBeInTheDocument();
  });
});
