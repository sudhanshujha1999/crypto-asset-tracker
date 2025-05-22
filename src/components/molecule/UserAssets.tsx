import { useAccount, useBalance } from 'wagmi';
import { useCryptoStore } from '@/store/useCryptoStore';
import { formatEther } from 'viem';
import Pill from '../atom/Pill';

// Common ERC20 tokens to check
const COMMON_TOKENS = [
  {
    address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', // USDT
    symbol: 'USDT',
    name: 'Tether USD',
    decimals: 6,
  },
  {
    address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
  },
  {
    address: '0x6B175474E89094C44Da98b954EedeAC495271d0F', // DAI
    symbol: 'DAI',
    name: 'Dai Stablecoin',
    decimals: 18,
  },
];

const UserAssets = () => {
  const { address, isConnected } = useAccount();
  const { data: nativeBalance } = useBalance({
    address,
  });
  const { selectedAssets, setSelectedAssets } = useCryptoStore();

  // Get token balances
  const tokenBalances = COMMON_TOKENS.map((token) => {
    const { data: balance } = useBalance({
      address,
      token: token.address as `0x${string}`,
    });
    return { ...token, balance };
  });

  if (!isConnected) {
    return (
      <div className="flex flex-col items-start pt-1 pb-3 px-4 w-full text-[#94adc7] font-['Inter'] text-sm leading-[1.3125rem]">
        Note: Connect your wallet to view your assets
      </div>
    );
  }

  const handleAssetClick = (assetId: string) => {
    if (selectedAssets.includes(assetId)) {
      setSelectedAssets(selectedAssets.filter((id) => id !== assetId));
    } else {
      setSelectedAssets([...selectedAssets, assetId]);
    }
  };

  const assets = [
    {
      id: 'ethereum',
      name: 'Ethereum',
      symbol: 'ETH',
      balance: nativeBalance ? formatEther(nativeBalance.value) : '0',
    },
    ...tokenBalances
      .filter((token) => token.balance && Number(token.balance.value) > 0)
      .map((token) => ({
        id: token.symbol.toLowerCase(),
        name: token.name.charAt(0).toUpperCase() + token.name.slice(1),
        symbol: token.symbol,
        balance: token.balance ? formatEther(token.balance.value) : '0',
      })),
  ];

  if (assets.length === 0) {
    return (
      <div className="flex flex-col items-start pt-1 pb-3 px-4 w-full text-[#94adc7] font-['Inter'] text-sm leading-[1.3125rem]">
        No assets found in wallet
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex flex-col items-start pt-1 pb-3 px-4 w-full text-[#94adc7] font-['Inter'] text-sm leading-[1.3125rem]">
        Your Assets
      </div>
      <div className="inline-flex flex-wrap items-start content-start gap-[0.75rem] py-[0.75rem]">
        {assets.map((asset) => (
          <Pill
            key={asset.id}
            onClick={() => handleAssetClick(asset.id)}
            selected={selectedAssets.includes(asset.id)}
          >
            <div className="flex items-center gap-[0.5rem]">
              <span className="font-medium">{asset.symbol}</span>
              <span className="text-sm opacity-75">({Number(asset.balance).toFixed(4)})</span>
            </div>
          </Pill>
        ))}
      </div>
    </div>
  );
};

export default UserAssets;
