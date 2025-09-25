// app/components/BlockDetails.tsx
'use client';

// ... (keep all your existing imports and logic)
import React from 'react';
import { Trie } from '@ethereumjs/trie'; 
import rlp from 'rlp'; 
import type { Block, Transaction } from 'viem';
type BlockWithParentHash = Block & { parentHash: string };

// Helper component for displaying data
const DetailItem = ({ label, value }: { label: string, value: React.ReactNode }) => (
  <div className="p-3 bg-gray-900 rounded-lg">
    <p className="text-sm text-gray-400 mb-1">{label}</p>
    <p className="text-sm text-purple-300 font-mono break-words">{value}</p>
  </div>
);

export function BlockDetails({ block }: { block: BlockWithParentHash | null }) {
  // ... (keep your existing Merkle Patricia Trie logic)
  const [calculatedRoot, setCalculatedRoot] = React.useState('Calculating...');
  React.useEffect(() => {
    const calculateRoot = async () => {
      if (!block || block.transactions.length === 0) {
        setCalculatedRoot('N/A');
        return;
      }
      const trie = new Trie();
      for (let i = 0; i < block.transactions.length; i++) {
        const tx = block.transactions[i] as Transaction;
        const txAsArray = [tx.nonce, tx.gasPrice, tx.gas, tx.to ? tx.to : '', tx.value, tx.input, tx.v, tx.r, tx.s];
        await trie.put(rlp.encode(i), rlp.encode(txAsArray));
      }
      setCalculatedRoot(`0x${trie.root().toString('hex')}`);
    };
    calculateRoot();
  }, [block]);

  if (!block) {
    return (
      <div className="w-full lg:w-2/3 p-4 bg-gray-900/50 border border-purple-900/50 backdrop-blur-sm rounded-xl flex items-center justify-center h-[80vh]">
        <p className="text-xl text-gray-500">Select a block to see its details</p>
      </div>
    );
  }

  return (
    <div className="w-full lg:w-2/3 p-4 bg-gray-900/50 border border-purple-900/50 backdrop-blur-sm rounded-xl h-[80vh] overflow-y-auto">
      <h2 className="text-xl font-bold mb-4 text-purple-300">Block #{block.number?.toString()} Details</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <DetailItem label="Hash" value={block.hash} />
        <DetailItem label="Parent Hash" value={block.parentHash} />
        <DetailItem label="Timestamp" value={new Date(Number(block.timestamp) * 1000).toLocaleString()} />
        <DetailItem label="Miner" value={block.miner} />
        <DetailItem label="Gas Used" value={block.gasUsed.toString()} />
        <DetailItem label="Signature (Extra Data)" value={block.extraData} />
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-bold text-purple-300">Merkle Trie Verification</h3>
        <div className="p-4 mt-2 bg-gray-900 rounded-lg font-mono text-xs space-y-2">
          <div>
            <p className="text-gray-400">Calculated Root:</p>
            <p className="text-green-400 break-words">{calculatedRoot}</p>
          </div>
          <div>
            <p className="text-gray-400">Official Block Root:</p>
            <p className="text-green-400 break-words">{block.transactionsRoot}</p>
          </div>
        </div>
      </div>
    </div>
  );
}