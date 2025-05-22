import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Dashboard from '../Dashboard';

// Mock child components
jest.mock('@/components/molecule/SearchBar', () => ({
  default: () => <div data-testid="search-bar">Mock SearchBar</div>,
}));
jest.mock('@/components/molecule/RecentAssets', () => ({
  default: () => <div data-testid="recent-assets">Mock RecentAssets</div>,
}));
jest.mock('@/components/molecule/UserAssets', () => ({
  default: () => <div data-testid="user-assets">Mock UserAssets</div>,
}));
jest.mock('@/components/organism/CryptoChart', () => ({
  CryptoChart: () => <div data-testid="crypto-chart">Mock CryptoChart</div>,
}));

describe('Dashboard Page', () => {
  it('renders the main title and child components', () => {
    render(<Dashboard />);

    // Check if the main title is rendered
    expect(screen.getByText(/Select a cryptocurrency/i)).toBeInTheDocument();

    // Check if the mocked child components are rendered
    expect(screen.getByTestId('search-bar')).toBeInTheDocument();
    expect(screen.getByTestId('recent-assets')).toBeInTheDocument();
    expect(screen.getByTestId('user-assets')).toBeInTheDocument();
    expect(screen.getByTestId('crypto-chart')).toBeInTheDocument();
  });
});
