import { screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import { FinalLessonSection } from './FinalLessonSection';
import { renderWithI18n } from '../../test/utils';

describe('FinalLessonSection', () => {
  test('renders summary items and resources', async () => {
    await renderWithI18n(<FinalLessonSection />);

    expect(screen.getByRole('heading', { name: 'Final Lesson' })).toBeInTheDocument();
    expect(screen.getByText('Key takeaways')).toBeInTheDocument();
    expect(screen.getByText('Survivor blueprint')).toBeInTheDocument();
  });

  test('shows crisis contacts with phone numbers', async () => {
    await renderWithI18n(<FinalLessonSection />);

    expect(screen.getByRole('link', { name: /Blue Line/ })).toHaveAttribute('href', 'tel:800120002');
    expect(screen.getByRole('link', { name: /Women/ })).toHaveAttribute('href', 'tel:800120226');
  });
});
