import React from 'react';
import Image from 'next/image';

interface TokenImageProps {
  tokenURI: string;
  tokenId: number;
  ownerAddress: string;
}

const TokenImage: React.FC<TokenImageProps> = ({ tokenURI, tokenId, ownerAddress }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col max-w-sm">
      <div className="p-4 flex items-center justify-between bg-gray-50">
        <h3 className="text-lg font-semibold">XueDAO House Asset #{tokenId}</h3>
        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">ERC-721</span>
      </div>
      <div className="p-4 flex-grow">
        <div className="mb-4 relative h-48 w-full">
          <Image 
            src={tokenURI}
            alt={`XueDAO House Asset ${tokenId}`}
            layout="fill"
            objectFit="cover"
            className="rounded"
          />
        </div>
        <div className="space-y-2">
          <p className="text-sm text-gray-600">
            <span className="font-semibold">持有者:</span> 
            <span className="ml-1 text-xs">{`${ownerAddress}`}</span>
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-semibold">Token ID:</span> 
            <span className="ml-1">{tokenId}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default TokenImage;
