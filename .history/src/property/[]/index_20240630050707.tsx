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

  if (!id) return <div>Loading...</div>;

  const { data: stakeInfo, isLoading } = useReadContract({
    address: etheRealAddress,
    abi: EtheRealABI,
    functionName: 'getStakeInfo',
    args: [BigInt(id.toString())],
  }) as { data: StakeInfo | undefined, isLoading: boolean };

  if (isLoading) return <div>Loading...</div>;
  if (!stakeInfo) return <div>Property not found</div>;

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />
      <main className="flex-grow py-16 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 bg-gray-50">
        <h1 className="text-4xl font-bold mb-8 text-gray-900">Property #{id} Details</h1>
        <div className="bg-white shadow-md rounded-lg p-6">
          <p className="text-gray-700"><strong>Owner:</strong> {stakeInfo.owner}</p>
          <p className="text-gray-700"><strong>Stake Time:</strong> {new Date(Number(stakeInfo.stakeTime) * 1000).toLocaleString()}</p>
          <p className="text-gray-700"><strong>Duration:</strong> {stakeInfo.duration.toString()} seconds</p>
          <p className="text-gray-700"><strong>Price Per Token:</strong> {formatEther(stakeInfo.pricePerToken)} ETH</p>
          <p className="text-gray-700"><strong>Rent Price Per Month:</strong> {formatEther(stakeInfo.rentPricePerMonth)} ETH</p>
          <p className="text-gray-700"><strong>Token Address:</strong> {stakeInfo.tokenAddress}</p>
          <p className="text-gray-700"><strong>Total Supply:</strong> {stakeInfo.totalSupply.toString()}</p>
          <p className="text-gray-700"><strong>Current Supply:</strong> {stakeInfo.currentSupply.toString()}</p>
          <p className="text-gray-700"><strong>Start Time:</strong> {new Date(Number(stakeInfo.startTime) * 1000).toLocaleString()}</p>
          <p className="text-gray-700"><strong>End Time:</strong> {new Date(Number(stakeInfo.endTime) * 1000).toLocaleString()}</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
