// app/components/BlockFeed.tsx
'use client';

import { useEffect, useState } from 'react';
import { useBlockNumber, usePublicClient } from 'wagmi';
import type { Block } from 'viem';

// Define a type for our block that includes the parentHash
type BlockWithParentHash = Block & { parentHash: string };

export function BlockFeed({ onBlockSelect }: { onBlockSelect: (block: BlockWithParentHash) => void }) {
  const [blocks, setBlocks] = useState<BlockWithParentHash[]>([]);
  const publicClient = usePublicClient();
  const { data: blockNumber } = useBlockNumber({ watch: true });

  useEffect(() => {
    const processBlock = async () => {
      // Guard against running before the client or block number are available
      if (!publicClient || typeof blockNumber === 'undefined') return;

      // --- THE NEW LOGIC IS HERE ---
      // If this is the first load (blocks array is empty), fetch the last 10 blocks.
      if (blocks.length === 0) {
        const blockPromises: Promise<BlockWithParentHash>[] = [];
        // Create an array of promises to fetch blocks concurrently
        for (let i = 0; i < 10; i++) {
          const pastBlockNumber = blockNumber - BigInt(i);
          if (pastBlockNumber >= 0) {
            blockPromises.push(
              publicClient.getBlock({ blockNumber: pastBlockNumber, includeTransactions: true }) as Promise<BlockWithParentHash>
            );
          }
        }
        // Await all promises and update state
        const pastBlocks = await Promise.all(blockPromises);
        setBlocks(pastBlocks);
        return; // Exit after the initial load
      }

      // --- EXISTING LOGIC FOR REAL-TIME UPDATES ---
      // If we already have blocks, only add the new one if it's not already in our list.
      const isNewBlock = blocks.every(b => b.number !== blockNumber);
      if (isNewBlock) {
        try {
          const newBlock = (await publicClient.getBlock({
            blockNumber,
            includeTransactions: true,
          })) as BlockWithParentHash;
          
          // Add the new block to the top of our list
          setBlocks(prevBlocks => [newBlock, ...prevBlocks.slice(0, 9)]);
        } catch (error) {
          console.error("Failed to fetch new block:", error);
        }
      }
    };

    processBlock();
  }, [blockNumber, publicClient, blocks.length]); // Add blocks.length to dependency array

  return (
    <div className="w-full lg:w-1/3 p-4 bg-gray-800 rounded-lg h-[80vh] overflow-y-auto">
      <h2 className="text-2xl font-bold mb-4 text-white">Latest Blocks</h2>
      <div className="space-y-4">
        {blocks.map((block, index) => (
          <div
            key={block.number?.toString()}
            onClick={() => onBlockSelect(block)}
            className="p-4 bg-gray-900 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors"
          >
            <p className="font-mono text-lg text-blue-400">
              Block #{block.number?.toString()}
            </p>
            <p className="text-xs text-gray-400 mt-2">
              <span className="font-semibold">Hash:</span> {`${block.hash?.slice(0, 10)}...${block.hash?.slice(-8)}`}
            </p>
            <p className="text-xs text-gray-500">
              <span className="font-semibold">Parent Hash:</span> {`${block.parentHash?.slice(0, 10)}...${block.parentHash?.slice(-8)}`}
            </p>
            <p className="text-sm mt-1 text-gray-300">
              {block.transactions.length} transactions
            </p>
            {/* Highlight the hash link between blocks */}
            {blocks[index + 1] && block.parentHash === blocks[index + 1].hash && (
              <div className="mt-2 text-center text-green-400 text-xs font-mono">
                🔗 Links to Block #{blocks[index + 1].number?.toString()}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}