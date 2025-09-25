// app/components/ContractInteractor.tsx
'use client';

import { useState } from 'react';
import { useWriteContract } from 'wagmi';
import { parseEther } from 'viem';
import { contractAddress, contractAbi } from '../lib/contract';

export function ContractInteractor() {
  const [modal, setModal] = useState<'addProperty' | 'payTax' | null>(null);
  const [propertyId, setPropertyId] = useState('');
  const [ownerAddress, setOwnerAddress] = useState('');
  const [taxAmount, setTaxAmount] = useState('');
  const { data: hash, isPending, error, writeContract } = useWriteContract();

  const handleAddProperty = (e: React.FormEvent) => {
    e.preventDefault();
    writeContract({ address: contractAddress, abi: contractAbi, functionName: 'addProperty', args: [propertyId, ownerAddress as `0x${string}`] });
  };

  const handlePayTax = (e: React.FormEvent) => {
    e.preventDefault();
    writeContract({ address: contractAddress, abi: contractAbi, functionName: 'payTax', args: [propertyId], value: parseEther(taxAmount) });
  };
  
  const closeModal = () => {
    setModal(null);
    setPropertyId('');
    setOwnerAddress('');
    setTaxAmount('');
  };

  return (
    <div className="w-full p-6 bg-gray-900/50 border border-purple-900/50 backdrop-blur-sm rounded-xl">
      <h2 className="text-xl font-bold mb-4 text-purple-300">Contract Actions</h2>
      <div className="flex flex-col sm:flex-row gap-4">
        <button onClick={() => setModal('addProperty')} className="flex-1 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">
          Add New Property
        </button>
        <button onClick={() => setModal('payTax')} className="flex-1 px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors">
          Pay Property Tax
        </button>
      </div>

      {isPending && <div className="mt-4 text-center text-blue-400">Transaction pending... Please confirm in your wallet.</div>}
      {hash && <div className="mt-4 text-center text-green-400">Success! Tx Hash: <a href={`#`} className="underline font-mono text-sm">{hash.slice(0,12)}...</a></div>}
      {error && <div className="mt-4 text-center text-red-400">Error: {error.shortMessage}</div>}

      {/* Modal logic */}
      {modal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex justify-center items-center z-50" onClick={closeModal}>
          <div className="bg-gray-900 border border-purple-800 p-8 rounded-xl w-full max-w-md shadow-2xl shadow-purple-900/20" onClick={e => e.stopPropagation()}>
            <h3 className="text-2xl font-bold mb-6 text-center text-purple-300">{modal === 'addProperty' ? 'Add New Property' : 'Pay Property Tax'}</h3>
            <form onSubmit={modal === 'addProperty' ? handleAddProperty : handlePayTax}>
              <input type="text" placeholder="Property ID (e.g., 'PROP123')" onChange={e => setPropertyId(e.target.value)} className="w-full p-3 mb-4 bg-gray-800 rounded-lg border border-gray-700 focus:ring-2 focus:ring-purple-500 focus:outline-none" />
              {modal === 'addProperty' ? (
                <input type="text" placeholder="Owner Address (0x...)" onChange={e => setOwnerAddress(e.target.value)} className="w-full p-3 mb-4 bg-gray-800 rounded-lg border border-gray-700 focus:ring-2 focus:ring-purple-500 focus:outline-none" />
              ) : (
                <input type="text" placeholder="Tax Amount (in ETH, e.g., '0.1')" onChange={e => setTaxAmount(e.target.value)} className="w-full p-3 mb-4 bg-gray-800 rounded-lg border border-gray-700 focus:ring-2 focus:ring-purple-500 focus:outline-none" />
              )}
              <div className="flex justify-end gap-4 mt-4">
                <button type="button" onClick={closeModal} className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600">Cancel</button>
                <button type="submit" disabled={isPending} className="px-6 py-2 bg-purple-600 font-semibold rounded-lg disabled:bg-gray-500 hover:bg-purple-700">{isPending ? 'Submitting...' : 'Submit Transaction'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}