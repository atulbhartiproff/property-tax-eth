// app/components/BlockFeed.tsx
'use client';

// ... (keep all your existing imports and logic)
import { useEffect, useState } from 'react';
import { useBlockNumber, usePublicClient } from 'wagmi';
import type { Block } from 'viem';
type BlockWithParentHash = Block & { parentHash: string };


export function BlockFeed({ onBlockSelect }: { onBlockSelect: (block: BlockWithParentHash) => void }) {
  const [blocks, setBlocks] = useState<BlockWithParentHash[]>([]);
  const publicClient = usePublicClient();
  const { data: blockNumber } = useBlockNumber({ watch: true });
  
  // ... (keep your existing useEffect logic to fetch blocks)
  useEffect(() => {
    const processBlock = async () => {
      if (!publicClient || typeof blockNumber === 'undefined') return;
      if (blocks.length === 0) {
        const blockPromises: Promise<BlockWithParentHash>[] = [];
        for (let i = 0; i < 10; i++) {
          const pastBlockNumber = blockNumber - BigInt(i);
          if (pastBlockNumber >= 0) {
            blockPromises.push(
              publicClient.getBlock({ blockNumber: pastBlockNumber, includeTransactions: true }) as Promise<BlockWithParentHash>
            );
          }
        }
        const pastBlocks = await Promise.all(blockPromises);
        setBlocks(pastBlocks);
        return;
      }
      const isNewBlock = blocks.every(b => b.number !== blockNumber);
      if (isNewBlock) {
        try {
          const newBlock = (await publicClient.getBlock({
            blockNumber,
            includeTransactions: true,
          })) as BlockWithParentHash;
          setBlocks(prevBlocks => [newBlock, ...prevBlocks.slice(0, 9)]);
        } catch (error) {
          console.error("Failed to fetch new block:", error);
        }
      }
    };
    processBlock();
  }, [blockNumber, publicClient, blocks.length]);

  return (
    <div className="w-full lg:w-1/3 p-4 bg-gray-900/50 border border-purple-900/50 backdrop-blur-sm rounded-xl h-[80vh] overflow-y-auto">
      <h2 className="text-xl font-bold mb-4 text-purple-300 sticky top-0 bg-gray-900/50 backdrop-blur-sm py-2">Latest Blocks</h2>
      <div className="space-y-3">
        {blocks.map((block, index) => (
          <div
            key={block.number?.toString()}
            onClick={() => onBlockSelect(block)}
            className="p-4 bg-gray-900 rounded-lg cursor-pointer hover:bg-purple-900/20 border border-transparent hover:border-purple-800 transition-all duration-300 group"
          >
            <div className="flex justify-between items-center">
              <p className="font-mono text-lg text-purple-400 group-hover:text-purple-300">
                Block #{block.number?.toString()}
              </p>
              <span className="px-2 py-1 text-xs bg-gray-800 rounded-full">{block.transactions.length} TXs</span>
            </div>
            <p className="text-xs text-gray-400 mt-2 font-mono break-all">
              <span className="font-semibold text-gray-500">Hash:</span> {block.hash}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}