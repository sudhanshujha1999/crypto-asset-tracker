import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import UserAssets from '../UserAssets';
import { useAccount, useBalance } from 'wagmi';
import { useCryptoStore } from '@/store/useCryptoStore';

// Mock wagmi hooks
jest.mock('wagmi', () => ({
  useAccount: jest.fn(),
  useBalance: jest.fn(),
}));

// Mock the useCryptoStore hook
jest.mock('@/store/useCryptoStore', () => ({
  useCryptoStore: jest.fn(),
}));

// Mock the formatEther function from viem (removed as it's no longer asserted on)
jest.mock('viem', () => ({
  ...jest.requireActual('viem'),
}));

// Mock the Pill component to simplify testing its rendering
jest.mock('../../atom/Pill', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe('UserAssets', () => {
  const mockUseAccount = useAccount as jest.Mock;
  const mockUseBalance = useBalance as jest.Mock;
  const mockUseCryptoStore = useCryptoStore as unknown as jest.Mock;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // Default mock implementations
    mockUseAccount.mockReturnValue({
      address: undefined,
      isConnected: false,
      isConnecting: false,
      isDisconnected: true,
      status: 'disconnected',
    });
    mockUseBalance.mockReturnValue({
      data: undefined,
      isError: false,
      isLoading: false,
      status: 'idle',
    });
    mockUseCryptoStore.mockReturnValue({
      assetDetails: {},
      selectedAssets: [],
      addSelectedAsset: jest.fn(),
      removeSelectedAsset: jest.fn(),
    });
  });

  it('renders loading state when account is loading', () => {
    mockUseAccount.mockReturnValue({
      address: undefined,
      isConnected: false,
      isConnecting: true,
      isDisconnected: false,
      status: 'connecting',
    });
    // No need to mock useBalance as we are testing the account loading state
    render(<UserAssets />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('renders connect wallet message when not connected', () => {
    render(<UserAssets />); // Default mock is disconnected
    expect(screen.getByText(/connect your wallet/i)).toBeInTheDocument();
  });

  it('renders ETH balance when connected', () => {
    mockUseAccount.mockReturnValue({
      address: '0x123',
      isConnected: true,
      isConnecting: false,
      isDisconnected: false,
      status: 'connected',
    });
    mockUseBalance.mockReturnValue({
      data: {
        value: BigInt(1e18), // 1 ETH in wei
        formatted: '1.0',
        symbol: 'ETH',
        decimals: 18,
      },
      isError: false,
      isLoading: false,
      status: 'success',
    });
    render(<UserAssets />);
    expect(screen.getByText('ETH')).toBeInTheDocument();
  });

  it('renders USDT balance when connected', () => {
    mockUseAccount.mockReturnValue({
      address: '0x123',
      isConnected: true,
      isConnecting: false,
      isDisconnected: false,
      status: 'connected',
    });
    mockUseBalance.mockReturnValue({
      data: {
        value: BigInt(100e6), // 100 USDT in lowest denomination (assuming 6 decimals)
        formatted: '100.0',
        symbol: 'USDT',
        decimals: 6,
      },
      isError: false,
      isLoading: false,
      status: 'success',
    });
    render(<UserAssets />);
    expect(screen.getByText('USDT')).toBeInTheDocument();
  });

  it('renders USDC balance when connected', () => {
    mockUseAccount.mockReturnValue({
      address: '0x123',
      isConnected: true,
      isConnecting: false,
      isDisconnected: false,
      status: 'connected',
    });
    mockUseBalance.mockReturnValue({
      data: {
        value: BigInt(50e6), // 50 USDC in lowest denomination (assuming 6 decimals)
        formatted: '50.0',
        symbol: 'USDC',
        decimals: 6,
      },
      isError: false,
      isLoading: false,
      status: 'success',
    });
    render(<UserAssets />);
    expect(screen.getByText('USDC')).toBeInTheDocument();
  });

  it('renders DAI balance when connected', () => {
    mockUseAccount.mockReturnValue({
      address: '0x123',
      isConnected: true,
      isConnecting: false,
      isDisconnected: false,
      status: 'connected',
    });
    mockUseBalance.mockReturnValue({
      data: {
        value: BigInt(200e18), // 200 DAI in wei
        formatted: '200.0',
        symbol: 'DAI',
        decimals: 18,
      },
      isError: false,
      isLoading: false,
      status: 'success',
    });
    render(<UserAssets />);
    expect(screen.getByText('DAI')).toBeInTheDocument();
  });

  it('renders loading state for balance', () => {
    mockUseAccount.mockReturnValue({
      address: '0x123',
      isConnected: true,
      isConnecting: false,
      isDisconnected: false,
      status: 'connected',
    });
    mockUseBalance.mockReturnValue({
      data: undefined,
      isError: false,
      isLoading: true,
      status: 'loading',
    });
    render(<UserAssets />);
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  it('renders error state for balance', () => {
    mockUseAccount.mockReturnValue({
      address: '0x123',
      isConnected: true,
      isConnecting: false,
      isDisconnected: false,
      status: 'connected',
    });
    mockUseBalance.mockReturnValue({
      data: undefined,
      isError: true,
      isLoading: false,
      status: 'error',
    });
    render(<UserAssets />);
    expect(screen.getByText(/Error fetching balance/i)).toBeInTheDocument();
  });
});
