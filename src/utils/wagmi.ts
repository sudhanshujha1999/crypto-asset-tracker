// wagmi.ts
import { createConfig, http } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { injected } from '@wagmi/connectors';

export const wagmiConfig = createConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(),
  },
  connectors: [injected()],
});
