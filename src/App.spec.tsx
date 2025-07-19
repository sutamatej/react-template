import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';


import * as UseTranslationsModule from './data/useTranslations';
import { App } from './App';

describe('App', () => {
  beforeEach(() => {
    spyOn(UseTranslationsModule, 'useTranslations')
      .and.callFake(UseTranslationsModule.useTranslationsFake);
  });

  it('renders number of times button was clicked', async () => {
    const user = userEvent.setup();

    render(<App />);
    const button = screen.getByRole('button', { name: /buttonLabel/i });
    await user.click(button);

    const result = screen.getByText(/status.label 1/i);
    expect(result).toBeInTheDocument();
  });
});
