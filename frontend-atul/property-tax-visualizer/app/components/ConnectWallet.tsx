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
      <div className="flex items-center gap-4">
        <div className="px-4 py-2 text-sm font-mono border border-purple-800 bg-purple-900/20 rounded-lg text-purple-300">
          {`${address?.slice(0, 6)}...${address?.slice(-4)}`}
        </div>
        <button
          onClick={() => disconnect()}
          className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-red-900/50 hover:text-red-400 transition-colors"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => connect({ connector: injected() })}
      className="px-6 py-2 bg-purple-600 font-semibold text-white rounded-lg hover:bg-purple-700 transition-colors shadow-[0_0_20px_rgba(147,51,234,0.5)]"
    >
      Connect MetaMask
    </button>
  );
}