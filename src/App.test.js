import { render, screen } from '@testing-library/react';
import App from './App';

test('renders app without crashing', async () => {
  render(<App />);
  // Wait for lazy loaded components if necessary, or just check static shell
  // We just want to ensure it doesn't crash on mount
  expect(document.body).toBeInTheDocument();
});
