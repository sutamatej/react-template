import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

import { App } from './App';

describe('App', () => {
  it('renders number of times button was clicked', async () => {
    const user = userEvent.setup()

    render(<App />);
    const button = screen.getByRole('button', { name: /click me/i });
    await user.click(button);

    const result = screen.getByText(/clicked 1 times/i);
    expect(result).toBeInTheDocument();
  });
});
