import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

import { App } from './App';
import * as UseTranslationsModule from './data/useTranslations';

function useTranslationsFake() {
  return {
    buttonLabel: 'click-me-button-label'
  }
}

describe('App', () => {
  beforeEach(() => {
    spyOn(UseTranslationsModule, 'useTranslations').and.callFake(useTranslationsFake);
  });

  it('renders number of times button was clicked', async () => {
    const user = userEvent.setup()

    render(<App />);
    const button = screen.getByRole('button', { name: /click-me-button-label/i });
    await user.click(button);

    const result = screen.getByText(/clicked 1 times/i);
    expect(result).toBeInTheDocument();
  });
});
