// app/page.tsx
'use client';

import { useState } from 'react';
import { BlockFeed } from './components/BlockFeed';
import { BlockDetails } from './components/BlockDetails';
import { ConnectWallet } from './components/ConnectWallet';
import { ContractInteractor } from './components/ContractInteractor';
import type { Block } from 'viem';

type BlockWithParentHash = Block & { parentHash: string };

export default function Home() {
  const [selectedBlock, setSelectedBlock] = useState<BlockWithParentHash | null>(null);

  const handleBlockSelect = (block: BlockWithParentHash) => {
    setSelectedBlock(block);
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Optional: Add a subtle background pattern */}
      <div className="absolute inset-0 z-0 opacity-10 bg-[radial-gradient(#4c1d95_1px,transparent_1px)] [background-size:24px_24px]"></div>
      
      <main className="relative z-10 flex flex-col items-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-screen-2xl">
          <header className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8 pb-4 border-b border-purple-900/50">
            <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400 mb-4 sm:mb-0">
              Property Tax Visualizer
            </h1>
            <ConnectWallet />
          </header>

          <ContractInteractor />

          <div className="flex flex-col lg:flex-row gap-6 mt-8">
            <BlockFeed onBlockSelect={handleBlockSelect} />
            <BlockDetails block={selectedBlock} />
          </div>
        </div>
      </main>
    </div>
  );
}