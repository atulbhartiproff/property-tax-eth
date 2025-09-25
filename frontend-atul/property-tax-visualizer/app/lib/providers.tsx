// app/lib/providers.tsx
'use client'; // This must be a client component

import React, { ReactNode } from 'react';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { foundry } from 'wagmi/chains'; // Wagmi has a built-in config for Foundry/Anvil
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// 1. Set up a QueryClient
const queryClient = new QueryClient();

// 2. Create a Wagmi config
export const config = createConfig({
  chains: [foundry], // Use the pre-configured Anvil chain
  transports: {
    [foundry.id]: http(), // Connect to the default Anvil RPC URL: http://127.0.0.1:8545
  },
});

// 3. Create the provider component
export function Providers({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}