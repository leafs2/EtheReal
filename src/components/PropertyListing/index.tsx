'use client';
import React, { useState, useEffect } from 'react';
import { useReadContract } from 'wagmi';
import PropertyCard from '@/components/PropertyCard';
import { etheRealAddress } from '@/contract/address/etheRealAddress';
import { EtheRealABI } from '@/contract/abi/EtheReal';
import Image from 'next/image';

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

export default function PropertyListing() {
  const [properties, setProperties] = useState<StakeInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentTokenId, setCurrentTokenId] = useState(1);
  const [hasMoreProperties, setHasMoreProperties] = useState(true);

  const { data: stakeInfo, isLoading, isError } = useReadContract({
    address: etheRealAddress,
    abi: EtheRealABI,
    functionName: 'getStakeInfo',
    args: [BigInt(currentTokenId)],
  });

  useEffect(() => {
    if (isLoading || !hasMoreProperties) return;

    if (isError) {
      console.error(`Error fetching data for tokenId ${currentTokenId}`);
      setError(`Failed to fetch data for tokenId ${currentTokenId}`);
      setHasMoreProperties(false);
      setLoading(false);
      return;
    }

    if (stakeInfo) {
      const typedStakeInfo = stakeInfo as StakeInfo;
      if (typedStakeInfo.owner !== '0x0000000000000000000000000000000000000000') {
        setProperties(prev => [...prev, typedStakeInfo]);
        setCurrentTokenId(prev => prev + 1);
      } else {
        setHasMoreProperties(false);
        setLoading(false);
      }
    }
  }, [stakeInfo, isLoading, isError, currentTokenId, hasMoreProperties]);

  useEffect(() => {
    if (!hasMoreProperties) {
      setLoading(false);
    }
  }, [hasMoreProperties]);

  if (loading) {
    return <div>Loading... (Loaded {properties.length} properties)</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container mx-auto pt-20 px-4">
      <h1 className="text-4xl font-bold text-center text-black mb-4">房地產列表</h1>
      <p className="text-center text-black mb-8">
        EtheReal 專門抑制你的炒房慾望，小壞蛋 !
      </p>
      {properties.length === 0 && (
        <div className="flex justify-center">
          <Image 
            src="/111.webp" 
            alt="Placeholder Image"
            width={500}
            height={300}
            className="object-contain"
          />
        </div>
      )}
      {properties.map((property, index) => (
        <PropertyCard key={index} property={property} tokenId={index + 1} />
      ))}
    </div>
  );
}
