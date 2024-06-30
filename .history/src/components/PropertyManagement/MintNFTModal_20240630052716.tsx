// src/components/PropertyManagement/MintNFTModal.tsx

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

interface MintNFTModalProps {
  show: boolean;
  handleClose: () => void;
  mintNFT: (houseOwner: string, houseURI: string) => Promise<void>;
}

export function MintNFTModal({ show, handleClose, mintNFT }: MintNFTModalProps) {
  const [houseOwner, setHouseOwner] = useState('');
  const [houseURI, setHouseURI] = useState('');

  const handleMint = async () => {
    try {
      await mintNFT(houseOwner, houseURI);
      handleClose();
    } catch (error) {
      console.error('Minting failed:', error);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Mint Property NFT</h2>
          <FontAwesomeIcon
            icon={faXmark}
            className="cursor-pointer"
            onClick={handleClose}
          />
        </div>
        <input
          type="text"
          placeholder="House Owner Address"
          className="w-full p-2 mb-4 border rounded"
          value={houseOwner}
          onChange={(e) => setHouseOwner(e.target.value)}
        />
        <input
          type="text"
          placeholder="House URI"
          className="w-full p-2 mb-4 border rounded"
          value={houseURI}
          onChange={(e) => setHouseURI(e.target.value)}
        />
        <button onClick={handleMint} className="btn-primary w-full">
          Mint NFT
        </button>
      </div>
    </div>
  );
}