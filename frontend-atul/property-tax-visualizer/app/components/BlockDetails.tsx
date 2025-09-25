// app/components/BlockDetails.tsx
'use client';

import { useMemo } from 'react';
import { MerkleTree } from 'merkletreejs';
import keccak256 from 'keccak256';
import type { Block } from 'viem';

// Define the type again for clarity
type BlockWithParentHash = Block & { parentHash: string };

export function BlockDetails({ block }: { block: BlockWithParentHash | null }) {
  // useMemo will recalculate the tree only when the block changes
  const merkleTreeData = useMemo(() => {
    if (!block || block.transactions.length === 0) {
      return { root: 'N/A', tree: null };
    }

    // Transactions in a block object are full transaction details, we need their hashes
    const txHashes = block.transactions.map(tx => (typeof tx === 'string' ? tx : tx.hash));
    
    // Create the leaves by hashing the transaction hashes
    const leaves = txHashes.map(hash => keccak256(hash));
    const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
    const root = tree.getHexRoot();

    return { root, tree };
  }, [block]);

  if (!block) {
    return (
      <div className="w-full lg:w-2/3 p-4 bg-gray-800 rounded-lg flex items-center justify-center">
        <p className="text-xl text-gray-400">Select a block to see its details</p>
      </div>
    );
  }

  return (
    <div className="w-full lg:w-2/3 p-4 bg-gray-800 rounded-lg h-[80vh] overflow-y-auto">
      <h2 className="text-2xl font-bold mb-4 text-white">Block #{block.number?.toString()} Details</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-sm">
        <div className="p-3 bg-gray-900 rounded">
          <p className="text-gray-400">Hash:</p>
          <p className="text-cyan-400 break-words">{block.hash}</p>
        </div>
        <div className="p-3 bg-gray-900 rounded">
          <p className="text-gray-400">Parent Hash:</p>
          <p className="text-cyan-400 break-words">{block.parentHash}</p>
        </div>
        <div className="p-3 bg-gray-900 rounded">
          <p className="text-gray-400">Timestamp:</p>
          <p className="text-white">{new Date(Number(block.timestamp) * 1000).toLocaleString()}</p>
        </div>
        <div className="p-3 bg-gray-900 rounded">
          <p className="text-gray-400">Miner:</p>
          <p className="text-white break-words">{block.miner}</p>
        </div>
        <div className="p-3 bg-gray-900 rounded">
          <p className="text-gray-400">Gas Used:</p>
          <p className="text-white">{block.gasUsed.toString()}</p>
        </div>
        <div className="p-3 bg-gray-900 rounded">
          <p className="text-gray-400">Signature (Extra Data):</p>
          <p className="text-white break-words">{block.extraData}</p>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-xl font-bold text-white">Merkle Tree</h3>
        <div className="p-4 mt-2 bg-gray-900 rounded-lg font-mono text-xs">

          <p className="text-gray-400 mt-2">Block's Merkle Root:</p>
          <p className="text-green-400 break-words">{block.transactionsRoot}</p>


        </div>
      </div>
    </div>
  );
}