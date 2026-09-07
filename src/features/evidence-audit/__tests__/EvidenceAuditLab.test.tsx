import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import EvidenceAuditLab from '../EvidenceAuditLab';
import rawCase from '../cases/case-0-pilot.json';

describe('EvidenceAuditLab', () => {
  it('renders the case title, sources and both exercises', () => {
    render(<EvidenceAuditLab />);

    expect(screen.getByRole('heading', { name: rawCase.case.title })).toBeInTheDocument();
    expect(screen.getByText(rawCase.case.auditQuestion)).toBeInTheDocument();
    expect(screen.getAllByText('Osoba A').length).toBeGreaterThan(0);
    expect(screen.getByRole('heading', { name: /Ile niezależnych źródeł/ })).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /Zakwalifikuj warstwy epistemiczne/ })
    ).toBeInTheDocument();
  });

  it('grades a correct independent-sources submission as correct', () => {
    render(<EvidenceAuditLab />);

    fireEvent.click(screen.getByLabelText(/Pierwotna relacja Osoby A/));
    fireEvent.click(screen.getByRole('button', { name: 'Sprawdź odpowiedź' }));

    expect(screen.getByRole('status')).toHaveTextContent('Poprawnie');
  });

  it('grades an over-counted independent-sources submission as incorrect', () => {
    render(<EvidenceAuditLab />);

    fireEvent.click(screen.getByLabelText(/Pierwotna relacja Osoby A/));
    fireEvent.click(screen.getByLabelText(/Własna wiedza Świadka C/));
    fireEvent.click(screen.getByRole('button', { name: 'Sprawdź odpowiedź' }));

    expect(screen.getByRole('status')).toHaveTextContent('To jeszcze nie to');
  });

  it('runs the engine audit panel and reports every sub-check passing', () => {
    render(<EvidenceAuditLab />);

    fireEvent.click(screen.getByRole('button', { name: 'Uruchom audyt silnika' }));

    expect(screen.getAllByText('✓')).toHaveLength(3);
  });
});
