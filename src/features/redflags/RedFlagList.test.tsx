import { fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { RedFlagList } from './RedFlagList';
import { useRedFlagsStore } from './redflags.store';
import type { RedFlagEntry } from './redflags.schema';

const seedEntries: RedFlagEntry[] = [
  {
    id: '1',
    date: '2024-01-10',
    category: 'gaslighting',
    intensity: 4,
    note: 'Podważanie faktów',
    createdAt: '2024-01-10T10:00:00.000Z'
  },
  {
    id: '2',
    date: '2024-01-12',
    category: 'discard',
    intensity: 2,
    note: 'Nagłe zrywanie kontaktu',
    createdAt: '2024-01-12T12:00:00.000Z'
  }
];

describe('RedFlagList', () => {
  beforeEach(() => {
    useRedFlagsStore.setState({ entries: seedEntries });
  });

  afterEach(() => {
    useRedFlagsStore.setState({ entries: [] });
  });

  it('filters entries by category', () => {
    render(<RedFlagList />);

    const list = screen.getByRole('list');
    expect(within(list).getAllByRole('listitem')).toHaveLength(2);

    const categorySelect = screen.getByLabelText(/kategoria|category|categorie/i);
    fireEvent.change(categorySelect, { target: { value: 'gaslighting' } });

    const listItems = within(screen.getByRole('list')).getAllByRole('listitem');
    expect(listItems).toHaveLength(1);
    expect(within(listItems[0]!).getByText(/Podważanie faktów/i)).toBeInTheDocument();
  });

  it('exports entries to JSON', async () => {
    const createObjectURL = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:url');
    const revokeObjectURL = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
    const appendSpy = vi.spyOn(document.body, 'append');
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});

    render(<RedFlagList />);

    const exportButton = screen.getByRole('button', { name: /eksportuj|export/i });
    fireEvent.click(exportButton);

    expect(createObjectURL).toHaveBeenCalledTimes(1);
    expect(appendSpy).toHaveBeenCalled();
    expect(clickSpy).toHaveBeenCalled();
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:url');

    const blob = createObjectURL.mock.calls[0]?.[0] as Blob;
    const text = await blob.text();
    expect(text).toContain('Podważanie faktów');

    createObjectURL.mockRestore();
    revokeObjectURL.mockRestore();
    appendSpy.mockRestore();
    clickSpy.mockRestore();
  });
});
