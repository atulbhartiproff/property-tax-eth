// app/components/ConnectWallet.tsx
'use client';

import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { injected } from 'wagmi/connectors';

export function ConnectWallet() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected) {
    return (
      <div className="text-right">
        <p className="text-sm text-gray-400">Connected: {`${address?.slice(0, 6)}...${address?.slice(-4)}`}</p>
        <button
          onClick={() => disconnect()}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => connect({ connector: injected() })} // injected() connects to MetaMask
      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
    >
      Connect MetaMask
    </button>
  );
}