import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { injected } from '@wagmi/connectors';
import { Button } from '@/components/atom/Button';
import { useSnackbar } from 'notistack';
import { useEffect } from 'react';

const injectedConnector = injected();

export function WalletConnectButton() {
  const { address, isConnected } = useAccount();
  const { connect, isPending, error } = useConnect();
  const { disconnect } = useDisconnect();
  const { enqueueSnackbar } = useSnackbar();

  const handleConnect = () => {
    connect({ connector: injectedConnector });
  };

  const handleDisconnect = () => {
    disconnect();
    enqueueSnackbar('Wallet disconnected', { variant: 'info' });
  };

  useEffect(() => {
    // Only show error toast if there's an error
    if (error) {
      const cleanErrorMessage = error.message.replace(/Version:.*$/, '').trim();
      enqueueSnackbar(cleanErrorMessage, { variant: 'error' });
    }
  }, [error, enqueueSnackbar]);

  useEffect(() => {
    // Only show success toast when connection is established
    // This will prevent duplicate toasts on page refresh
    if (isConnected && !error) {
      enqueueSnackbar('Wallet connected successfully!', { variant: 'success' });
    }
  }, [isConnected, error, enqueueSnackbar]);

  return isConnected ? (
    <div className="flex items-center gap-[0.5rem]">
      <span className="text-xs px-[0.5rem] py-[0.5rem] text-muted-foreground truncate max-w-[140px]">
        {address}
      </span>
      <Button variant="outline" size="sm" onClick={handleDisconnect}>
        Disconnect
      </Button>
    </div>
  ) : (
    <div className="flex flex-col gap-1">
      <Button variant="outline" size='lg' onClick={handleConnect} disabled={isPending}>
        {isPending ? 'Connecting...' : 'Connect Wallet'}
      </Button>
    </div>
  );
} 