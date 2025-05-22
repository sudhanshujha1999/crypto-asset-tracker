import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SearchBar from '../SearchBar';
import { useCryptoStore } from '../../../store/useCryptoStore';
import { searchCrypto } from '../../../api/coingecko';
import { act } from 'react';

// Mock the crypto store
jest.mock('../../../store/useCryptoStore', () => ({
  useCryptoStore: jest.fn(),
}));

// Mock the API
jest.mock('../../../api/coingecko', () => ({
  searchCrypto: jest.fn(),
}));

// Mock notistack hook
jest.mock('notistack', () => ({
  useSnackbar: () => ({
    enqueueSnackbar: jest.fn(),
  }),
}));

describe('SearchBar', () => {
  const mockUseCryptoStore = useCryptoStore as unknown as jest.Mock;
  const mockSearchCrypto = searchCrypto as jest.Mock;
  const mockSetSelectedAssets = jest.fn();
  const mockSetAssetDetails = jest.fn();
  const mockUpdateLastAccessed = jest.fn();

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    jest.useRealTimers(); // Use real timers by default

    // Default mock implementations
    mockUseCryptoStore.mockReturnValue({
      setSelectedAssets: mockSetSelectedAssets,
      setAssetDetails: mockSetAssetDetails,
      updateLastAccessed: mockUpdateLastAccessed,
      selectedAssets: [],
    });

    mockSearchCrypto.mockResolvedValue([]);
  });

  afterEach(() => {
    jest.useRealTimers(); // Ensure real timers are restored
  });

  it('renders search input', () => {
    render(<SearchBar />);
    expect(screen.getByPlaceholderText(/search cryptocurrencies/i)).toBeInTheDocument();
  });

  it('shows loading state while searching', async () => {
    mockSearchCrypto.mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)));

    render(<SearchBar />);
    const input = screen.getByPlaceholderText(/search cryptocurrencies/i);

    fireEvent.change(input, { target: { value: 'bitcoin' } });

    // Open the dropdown to see the loading message
    fireEvent.click(input);

    await waitFor(() => {
      expect(screen.getByText(/loading.../i)).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.queryByText(/loading.../i)).not.toBeInTheDocument();
    });
  });

  it('displays search results', async () => {
    const mockResults = [
      { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', market_cap_rank: 1 },
      { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', market_cap_rank: 2 },
    ];
    mockSearchCrypto.mockResolvedValue(mockResults);

    render(<SearchBar />);
    const input = screen.getByPlaceholderText(/search cryptocurrencies/i);

    fireEvent.change(input, { target: { value: 'bit' } });

    // Open the dropdown to see the results
    fireEvent.click(input);

    await waitFor(() => {
      expect(screen.getByText('Bitcoin (BTC)')).toBeInTheDocument();
      expect(screen.getByText('Ethereum (ETH)')).toBeInTheDocument();
    });
  });

  it('handles empty search results', async () => {
    mockSearchCrypto.mockResolvedValue([]);

    render(<SearchBar />);
    const input = screen.getByPlaceholderText(/search cryptocurrencies/i);

    fireEvent.change(input, { target: { value: 'nonexistent' } });

    // Open the dropdown
    fireEvent.click(input);

    await waitFor(() => {
      expect(screen.getByText(/no results found/i)).toBeInTheDocument();
    });
  });

  it('selects asset when clicked', async () => {
    const mockResults = [{ id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', market_cap_rank: 1 }];
    mockSearchCrypto.mockResolvedValue(mockResults);

    render(<SearchBar />);
    const input = screen.getByPlaceholderText(/search cryptocurrencies/i);

    fireEvent.change(input, { target: { value: 'bit' } });

    // Open the dropdown
    fireEvent.click(input);

    await waitFor(() => {
      expect(screen.getByText('Bitcoin (BTC)')).toBeInTheDocument();
    });

    const bitcoinResult = screen.getByText('Bitcoin (BTC)');
    fireEvent.click(bitcoinResult);

    expect(mockSetSelectedAssets).toHaveBeenCalledWith(['bitcoin']);
    expect(mockSetAssetDetails).toHaveBeenCalledWith('bitcoin', {
      id: 'bitcoin',
      name: 'Bitcoin',
      symbol: 'BTC',
      current_price: 0,
      price_change_percentage_24h: 0,
      market_cap: 0,
    });
  });

  it('debounces search input', async () => {
    jest.useFakeTimers();
    mockSearchCrypto.mockResolvedValue([]);

    render(<SearchBar />);
    const input = screen.getByPlaceholderText(/search cryptocurrencies/i);

    fireEvent.change(input, { target: { value: 'b' } });
    fireEvent.change(input, { target: { value: 'bi' } });
    fireEvent.change(input, { target: { value: 'bit' } });

    expect(mockSearchCrypto).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => {
      expect(mockSearchCrypto).toHaveBeenCalledTimes(1);
      expect(mockSearchCrypto).toHaveBeenCalledWith('bit');
    });

    jest.useRealTimers();
  });

  it('removes selected asset when X is clicked', async () => {
    const mockResults = [{ id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', market_cap_rank: 1 }];
    mockSearchCrypto.mockResolvedValue(mockResults);

    // Start with bitcoin selected
    mockUseCryptoStore.mockReturnValue({
      setSelectedAssets: mockSetSelectedAssets,
      setAssetDetails: mockSetAssetDetails,
      updateLastAccessed: mockUpdateLastAccessed,
      selectedAssets: ['bitcoin'],
    });

    render(<SearchBar />);

    // Wait for the selected asset pill to appear
    await waitFor(() => {
      expect(screen.getByText('Bitcoin')).toBeInTheDocument();
    });

    const removeButton = screen.getByRole('button', { name: /remove bitcoin/i }); // Assuming an accessible name for the remove button
    fireEvent.click(removeButton);

    expect(mockSetSelectedAssets).toHaveBeenCalledWith([]);
  });
});
