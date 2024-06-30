// src/components/PropertyManagement/WithdrawModal.tsx

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

interface WithdrawModalProps {
  show: boolean;
  handleClose: () => void;
  withdraw: (tokenId: number, isNFT: boolean) => Promise<void>;
}

export function WithdrawModal({ show, handleClose, withdraw }: WithdrawModalProps) {
  const [tokenId, setTokenId] = useState('');
  const [withdrawType, setWithdrawType] = useState<'nft' | 'eth'>('nft');

  const handleWithdraw = async () => {
    try {
      await withdraw(parseInt(tokenId), withdrawType === 'nft');
      handleClose();
    } catch (error) {
      console.error('Withdrawal failed:', error);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">提領</h2>
          <FontAwesomeIcon
            icon={faXmark}
            className="cursor-pointer"
            onClick={handleClose}
          />
        </div>
        <input
          type="number"
          placeholder="Token ID"
          className="w-full p-2 mb-4 border rounded"
          value={tokenId}
          onChange={(e) => setTokenId(e.target.value)}
        />
        <div className="mb-4">
          <label className="mr-4">
            <input
              type="radio"
              value="nft"
              checked={withdrawType === 'nft'}
              onChange={() => setWithdrawType('nft')}
            /> 提領 NFT
          </label>
          <label>
            <input
              type="radio"
              value="eth"
              checked={withdrawType === 'eth'}
              onChange={() => setWithdrawType('eth')}
            /> 提領 ETH
          </label>
        </div>
        <button onClick={handleWithdraw} className="btn-primary w-full">
        提領
        </button>
      </div>
    </div>
  );
}