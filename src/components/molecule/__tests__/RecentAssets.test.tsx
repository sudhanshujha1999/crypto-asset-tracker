import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import RecentAssets from '../RecentAssets';
import { useCryptoStore } from '../../../store/useCryptoStore';
import { act } from 'react';

// Mock the crypto store
jest.mock('../../../store/useCryptoStore', () => ({
  useCryptoStore: jest.fn(),
}));

// Mock the Pill component to include role="button"
jest.mock('../../atom/Pill', () => ({
  __esModule: true,
  default: ({
    children,
    onClick,
    selected,
  }: {
    children: React.ReactNode;
    onClick: () => void;
    selected: boolean;
  }) => (
    <div role="button" onClick={onClick} data-selected={selected}>
      {children}
    </div>
  ),
}));

describe('RecentAssets', () => {
  const mockUseCryptoStore = useCryptoStore as unknown as jest.Mock;
  const mockSetSelectedAssets = jest.fn();
  const mockUpdateLastAccessed = jest.fn();

  const mockAssets = {
    bitcoin: {
      '7': {},
    },
    ethereum: {
      '7': {},
    },
    litecoin: {
      '7': {},
    },
  };

  const mockAssetDetails = {
    bitcoin: { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC' },
    ethereum: { id: 'ethereum', name: 'Ethereum', symbol: 'ETH' },
    litecoin: { id: 'litecoin', name: 'Litecoin', symbol: 'LTC' },
  };

  const mockLastAccessed = {
    bitcoin: Date.now() - 1000, // most recent
    ethereum: Date.now() - 2000,
    litecoin: Date.now() - 3000, // least recent
  };

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    // Default mock implementation
    mockUseCryptoStore.mockReturnValue({
      data: mockAssets,
      assetDetails: mockAssetDetails,
      lastAccessed: mockLastAccessed,
      setSelectedAssets: mockSetSelectedAssets,
      selectedAssets: [],
      updateLastAccessed: mockUpdateLastAccessed,
    });
  });

  it('renders recent assets in order of last accessed', () => {
    act(() => {
      render(<RecentAssets />);
    });

    const assets = screen.getAllByRole('button');
    expect(assets).toHaveLength(Object.keys(mockAssets).length);

    // Check the order based on last accessed time (most recent first)
    expect(assets[0]).toHaveTextContent('Bitcoin');
    expect(assets[1]).toHaveTextContent('Ethereum');
    expect(assets[2]).toHaveTextContent('Litecoin');
  });

  it('calls setSelectedAssets and updateLastAccessed when an asset is clicked', () => {
    act(() => {
      render(<RecentAssets />);
    });

    const bitcoinPill = screen.getByText('Bitcoin').closest('div[role="button"]');
    fireEvent.click(bitcoinPill as Element);

    expect(mockSetSelectedAssets).toHaveBeenCalledWith(['bitcoin']);
    expect(mockUpdateLastAccessed).toHaveBeenCalledWith('bitcoin');
  });

  it('renders null when no assets are available', () => {
    mockUseCryptoStore.mockReturnValue({
      data: {},
      assetDetails: {},
      lastAccessed: {},
      setSelectedAssets: mockSetSelectedAssets,
      selectedAssets: [],
      updateLastAccessed: mockUpdateLastAccessed,
    });

    const { container } = render(<RecentAssets />);
    expect(container.firstChild).toBeNull();
  });

  it('limits display to 10 most recent assets', () => {
    const manyAssets: Record<string, any> = {};
    const manyAssetDetails: Record<string, any> = {};
    const manyLastAccessed: Record<string, number> = {};

    // Create 15 assets
    for (let i = 0; i < 15; i++) {
      const id = `asset${i}`;
      manyAssets[id] = { '7': {} };
      manyAssetDetails[id] = { id: id, name: `Asset${i}`, symbol: `A${i}` };
      manyLastAccessed[id] = Date.now() - i * 1000;
    }

    mockUseCryptoStore.mockReturnValue({
      data: manyAssets,
      assetDetails: manyAssetDetails,
      lastAccessed: manyLastAccessed,
      setSelectedAssets: mockSetSelectedAssets,
      selectedAssets: [],
      updateLastAccessed: mockUpdateLastAccessed,
    });

    act(() => {
      render(<RecentAssets />);
    });
    const assets = screen.getAllByRole('button');
    expect(assets).toHaveLength(10); // Should only show 10 assets

    // Check that the 10 most recent assets are displayed
    for (let i = 0; i < 10; i++) {
      expect(screen.getByText(`Asset${i}`)).toBeInTheDocument();
    }
    // Check that the 11th asset is not displayed
    expect(screen.queryByText('Asset10')).not.toBeInTheDocument();
  });
});
