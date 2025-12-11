import { type MockModuleContext, after, before, describe, it, mock } from 'node:test';
import { render, screen } from '@testing-library/react';
import assert from 'node:assert';
import { userEvent } from '@testing-library/user-event';

describe('App', () => {
  let translationsMock: MockModuleContext | null = null;

  before(() => {
    translationsMock = mock.module('./data/useTranslations', {
      namedExports: {
        useTranslations: () => (key: unknown, ...args: unknown[]): string => (`${key} ${args.join(' ')}`)
      }
    });
  });

  after(() => {
    translationsMock?.restore();
  });

  it('renders number of times button was clicked', async () => {
    const { App } = await import('./App');
    const user = userEvent.setup();

    render(<App />);
    const button = screen.getByRole('button', { name: /buttonLabel.text/i });
    await user.click(button);

    const result = screen.getByText(/status.label.text 1/i);
    assert.ok(result);
  });
});
