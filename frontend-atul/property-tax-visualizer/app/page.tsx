// app/page.tsx
'use client';

import { useState } from 'react';
import { BlockFeed } from './components/BlockFeed';
import { BlockDetails } from './components/BlockDetails';
import { ConnectWallet } from './components/ConnectWallet';
import type { Block } from 'viem';

// Define the type again for clarity
type BlockWithParentHash = Block & { parentHash: string };

export default function Home() {
  const [selectedBlock, setSelectedBlock] = useState<BlockWithParentHash | null>(null);

  const handleBlockSelect = (block: BlockWithParentHash) => {
    setSelectedBlock(block);
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-gray-950 text-white">
      <div className="w-full max-w-7xl">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Property Tax Blockchain Visualizer</h1>
          <ConnectWallet />
        </header>

        <div className="flex flex-col lg:flex-row gap-6">
          <BlockFeed onBlockSelect={handleBlockSelect} />
          <BlockDetails block={selectedBlock} />
        </div>
      </div>
    </main>
  );
}