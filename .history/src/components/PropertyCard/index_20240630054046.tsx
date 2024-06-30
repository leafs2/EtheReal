import Link from 'next/link';
import { formatEther } from 'ethers';
import { useReadContract } from 'wagmi'
import { houseAssetAddress } from '@/contract/address/houseAssetAddress';
import { HouseAssetABI }  from '@/contract/abi/HouseAsset';
import TokenImage from '@/components/TokenImage';

interface StakeInfo {
  owner: string;
  stakeTime: bigint;
  duration: bigint;
  pricePerToken: bigint;
  rentPricePerMonth: bigint;
  tokenAddress: string;
  totalSupply: bigint;
  currentSupply: bigint;
  startTime: bigint;
  endTime: bigint;
}

interface PropertyCardProps {
  property: StakeInfo;
  tokenId: number;
}

const formatNumber = (num: bigint) => {
  return new Intl.NumberFormat('en-US').format(Number(num));
};

const formatDate = (timestamp: bigint) => {
  const date = new Date(Number(timestamp) * 1000);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};

export default function PropertyCard({ property, tokenId }: PropertyCardProps) {
  const { data: tokenURI } = useReadContract({
    address: houseAssetAddress,
    abi: HouseAssetABI,
    functionName: 'tokenIdToURI',
    args: [tokenId],
  });

  const { data: ownerAddress } = useReadContract({
    address: houseAssetAddress,
    abi: HouseAssetABI,
    functionName: 'ownerOf',
    args: [tokenId],
  });

  const { data: nextTokenId } = useReadContract({
    address: houseAssetAddress,
    abi: HouseAssetABI,
    functionName: 'nextTokenId',
  });

  const tokenURIString = tokenURI?.toString() || 'No URI available';

  if (!property) {
    return <div>Invalid property data</div>;
  }

  return (
      <div className="relative w-full h-48">
        {tokenURIString !== 'No URI available' && (
          <TokenImage tokenURI={tokenURIString} tokenId={(Number(nextTokenId) - 1)} ownerAddress={ownerAddress as string} />
        )}
      <div className="p-4">
        <h2 className="text-xl font-bold mb-2 text-gray-900">Property #{tokenId}</h2>
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600">Price Per Token</span>
          <span className="property-value text-gray-900" aria-label={`${formatEther(property.pricePerToken)} ETH per token`}>
            {formatEther(property.pricePerToken)} ETH
          </span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600">End Time</span>
          <span className="property-value text-gray-900" aria-label={`End time: ${formatDate(property.endTime)}`}>
            {formatDate(property.endTime)}
          </span>
        </div>
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-600">Current Supply</span>
          <span className="property-value text-gray-900" aria-label={`Current supply: ${formatNumber(property.currentSupply)}`}>
            {formatNumber(property.currentSupply)}
          </span>
        </div>
        <Link 
          href={`/property/${tokenId}`}
          className="btn-primary w-full block text-center mb-2 bg-gray-800 text-white py-2 px-4 rounded"
        >
          View Details
        </Link>
        <Link 
          href={`/buy/${tokenId}`}
          className="btn-secondary w-full block text-center bg-gray-600 text-white py-2 px-4 rounded"
        >
          Buy Tokens
        </Link>
      </div>
    </div>
  );
}
