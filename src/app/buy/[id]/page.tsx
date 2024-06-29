'use client';
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { etheRealAddress } from '@/contract/address/etheRealAddress';
import { EtheRealABI } from '@/contract/abi/EtheReal';
import Swal from 'sweetalert2';
import { parseEther, formatEther } from 'ethers';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function BuyToken() {
  const params = useParams();
  const id = params?.id as string;
  const [amount, setAmount] = useState('');
  const [totalPrice, setTotalPrice] = useState('0');
  const { address, isConnected } = useAccount();

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
  
  const { data: stakeInfo } = useReadContract({
    address: etheRealAddress,
    abi: EtheRealABI,
    functionName: 'getStakeInfo',
    args: [BigInt(id)],
  }) as { data: StakeInfo | undefined };

  const { data: minAmount } = useReadContract({
    address: etheRealAddress,
    abi: EtheRealABI,
    functionName: 'minAmount',
    args: [BigInt(id)],
  });

  const { writeContract: buyTokens, data: buyData } = useWriteContract();

  const { isLoading: isBuying, isSuccess: isBought } = useWaitForTransactionReceipt({ hash: buyData });

  useEffect(() => {
    if (stakeInfo && amount) {
      const price = BigInt(amount) * (stakeInfo.pricePerToken as bigint);
      setTotalPrice(formatEther(price));
    }
  }, [amount, stakeInfo]);

  useEffect(() => {
    if (isBought) {
      Swal.fire({
        title: '購買成功！',
        icon: 'success',
      });
      setAmount('');
    }
  }, [isBought]);

  const handleBuyTokens = async () => {
    if (!stakeInfo || !amount) return;

    try {
      await buyTokens({
        address: etheRealAddress,
        abi: EtheRealABI,
        functionName: 'buyTokens',
        args: [BigInt(amount), BigInt(id)],
        value: parseEther(totalPrice),
      });
    } catch (error) {
      console.error('購買代幣失敗:', error);
      Swal.fire('錯誤', `購買代幣失敗: ${error}`, 'error');
    }
  };

  if (!isConnected) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <p className="text-2xl text-gray-800">請連結錢包。</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />
      <main className="flex-grow py-16 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 bg-gray-50">
        <h1 className="text-4xl font-bold mb-8 text-gray-900">購買代幣 #{id}</h1>
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amount">
              代幣數量
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="amount"
              type="number"
              placeholder="輸入數量"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min={minAmount?.toString()}
            />
          </div>
          <div className="mb-4">
            <p className="text-gray-700">總價: {totalPrice} ETH</p>
            <p className="text-gray-700">最低購買量: {minAmount?.toString() || '加载中...'}</p>
          </div>
          <button
            onClick={handleBuyTokens}
            disabled={isBuying}
            className="btn-primary w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors duration-300"
          >
            {isBuying ? '購買中...' : '購買代幣'}
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
