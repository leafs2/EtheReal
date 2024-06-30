// src/pages/property/[id].tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { etheRealAddress } from '@/contract/address/addresses';
import { EtheRealABI } from '@/contract/abi/abis';
import { parseEther, formatEther } from 'ethers';

export default function PropertyDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [amount, setAmount] = useState('');
  const [minAmount, setMinAmount] = useState('0');

  const { data: nftInfo, refetch: refetchNftInfo } = useReadContract({
    address: etheRealAddress,
    abi: EtheRealABI,
    functionName: 'getStakeInfo',
    args: id ? [BigInt(id as string)] : undefined,
    enabled: !!id,
  });

  const { data: minAmountData } = useReadContract({
    address: etheRealAddress,
    abi: EtheRealABI,
    functionName: 'minAmount',
    args: id ? [BigInt(id as string)] : undefined,
    enabled: !!id,
  });

  useEffect(() => {
    if (minAmountData) {
      setMinAmount(minAmountData.toString());
    }
  }, [minAmountData]);

  const { writeContract: buyTokens, data: buyData } = useWriteContract();

  const { isLoading: isBuying, isSuccess: isBought } = useWaitForTransactionReceipt({ hash: buyData?.hash });

  const handleBuy = async () => {
    if (!amount || !nftInfo || !id) return;
    const amountBigInt = parseEther(amount);
    const price = amountBigInt * BigInt(nftInfo.pricePerToken);
    
    if (amountBigInt < BigInt(minAmount)) {
      alert(`Minimum amount is ${formatEther(minAmount)} tokens`);
      return;
    }

    const nowTime = Math.floor(Date.now() / 1000);
    if (nowTime <= Number(nftInfo.startTime)) {
      alert("Sale has not started yet");
      return;
    }
    if (nowTime >= Number(nftInfo.endTime)) {
      alert("Sale has ended");
      return;
    }

    try {
      await buyTokens({
        address: etheRealAddress,
        abi: EtheRealABI,
        functionName: 'buyTokens',
        args: [amountBigInt, BigInt(id as string)],
        value: price,
      });
    } catch (error) {
      console.error('Buy tokens failed:', error);
      alert(`Failed to buy tokens: ${error.message}`);
    }
  };

  useEffect(() => {
    if (isBought) {
      refetchNftInfo();
    }
  }, [isBought, refetchNftInfo]);

  if (!nftInfo) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">NFT #{id}</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <p>Price per Token: {formatEther(nftInfo.pricePerToken)} ETH</p>
        <p>Total Supply: {nftInfo.totalSupply.toString()}</p>
        <p>Current Supply: {nftInfo.currentSupply.toString()}</p>
        <p>Start Time: {new Date(Number(nftInfo.startTime) * 1000).toLocaleString()}</p>
        <p>End Time: {new Date(Number(nftInfo.endTime) * 1000).toLocaleString()}</p>
        <p>Minimum Amount: {formatEther(minAmount)} tokens</p>
        <div className="mt-4">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount of tokens to buy"
            className="border p-2 mr-2"
            min={formatEther(minAmount)}
            step="0.000000000000000001"
          />
          <button
            onClick={handleBuy}
            disabled={isBuying}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            {isBuying ? 'Buying...' : 'Buy Tokens'}
          </button>
        </div>
        {isBought && <p className="mt-2 text-green-500">Purchase successful!</p>}
      </div>
    </div>
  );
}