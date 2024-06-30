'use client';
import { useParams } from 'next/navigation';
import { useReadContract } from 'wagmi';
import { etheRealAddress } from '@/contract/address/etheRealAddress';
import { EtheRealABI } from '@/contract/abi/EtheReal';
import { formatEther } from 'ethers';
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

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

export default function PropertyDetails() {
  const params = useParams();
  const id = params?.id;

  const { data: stakeInfo, isLoading } = useReadContract({
    address: etheRealAddress,
    abi: EtheRealABI,
    functionName: 'getStakeInfo',
    args: id ? [BigInt(id.toString())] : [],
  }) as { data: StakeInfo | undefined, isLoading: boolean };

  if (!id) return <div>Loading...</div>;

  if (isLoading) return <div>Loading...</div>;
  if (!stakeInfo) return <div>找不到房地產</div>;

  // 將秒數轉換為天和小時
  const durationInSeconds = stakeInfo.duration;
  const days = Math.floor(Number(durationInSeconds) / (24 * 3600));
  const hours = Math.floor((Number(durationInSeconds) % (24 * 3600)) / 3600);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />
      <main className="flex-grow py-16 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 bg-gray-50">
        <h1 className="text-4xl font-bold mb-8 text-gray-900">房地產 #{id} 細節</h1>
        <div className="bg-white shadow-md rounded-lg p-6">
          <p className="text-gray-700"><strong>擁有者:</strong> {stakeInfo.owner}</p>
          <p className="text-gray-700"><strong>質押時間:</strong> {new Date(Number(stakeInfo.stakeTime) * 1000).toLocaleString()}</p>
          <p className="text-gray-700"><strong>時長:</strong> {days} 天 {hours} 小時</p>
          <p className="text-gray-700"><strong>每個代幣的價格:</strong> {formatEther(stakeInfo.pricePerToken)} ETH</p>
          <p className="text-gray-700"><strong>每月租金:</strong> {formatEther(stakeInfo.rentPricePerMonth)} ETH</p>
          <p className="text-gray-700"><strong>代幣總發行量:</strong> {stakeInfo.totalSupply.toString()}</p>
          <p className="text-gray-700"><strong>目前售出:</strong> {stakeInfo.currentSupply.toString()}</p>
          <p className="text-gray-700"><strong>開始時間:</strong> {new Date(Number(stakeInfo.startTime) * 1000).toLocaleString()}</p>
          <p className="text-gray-700"><strong>結束時間:</strong> {new Date(Number(stakeInfo.endTime) * 1000).toLocaleString()}</p>
          <p className="text-gray-700"><strong>代幣地址:</strong> {stakeInfo.tokenAddress}</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
