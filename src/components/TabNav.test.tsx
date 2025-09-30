import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useState } from 'react';

import { TabNav, type TabDefinition } from './TabNav';

function TabNavWrapper({ tabs }: { tabs: TabDefinition[] }) {
  const [active, setActive] = useState(tabs[0]!.id);
  return <TabNav tabs={tabs} activeTab={active} onChange={setActive} ariaLabel="Test tabs" />;
}

describe('TabNav', () => {
  const tabs: TabDefinition[] = [
    { id: 'one', label: 'One', panelId: 'panel-one' },
    { id: 'two', label: 'Two', panelId: 'panel-two' }
  ];

  it('marks the active tab with aria-selected', () => {
    render(<TabNavWrapper tabs={tabs} />);

    const firstTab = screen.getByRole('tab', { name: 'One' });
    const secondTab = screen.getByRole('tab', { name: 'Two' });
    expect(firstTab).toHaveAttribute('aria-selected', 'true');
    expect(secondTab).toHaveAttribute('aria-selected', 'false');

    fireEvent.click(secondTab);
    expect(firstTab).toHaveAttribute('aria-selected', 'false');
    expect(secondTab).toHaveAttribute('aria-selected', 'true');
  });

  it('navigates with arrow keys', () => {
    render(<TabNavWrapper tabs={tabs} />);
    const firstTab = screen.getByRole('tab', { name: 'One' });
    const secondTab = screen.getByRole('tab', { name: 'Two' });

    firstTab.focus();
    fireEvent.keyDown(firstTab, { key: 'ArrowRight' });

    expect(secondTab).toHaveFocus();
    expect(secondTab).toHaveAttribute('aria-selected', 'true');
  });
});
