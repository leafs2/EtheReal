'use client';
import React, { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { etheRealAddress } from '@/contract/address/etheRealAddress';
import { houseAssetAddress } from '@/contract/address/houseAssetAddress';
import { EtheRealABI } from '@/contract/abi/EtheReal';
import { HouseAssetABI } from '@/contract/abi/HouseAsset';
import { MintNFTModal } from './MintNFTModal';
import { StakeNFTModal } from './StakeNFTModal';
import { WithdrawModal } from './WithdrawModal';
import Swal from 'sweetalert2';
import TokenImage from '@/components/TokenImage';
import Image from 'next/image'; // Ensure you're using the correct import

export default function PropertyManagement() {
  const [showMintModal, setShowMintModal] = useState(false);
  const [showStakeModal, setShowStakeModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [nfts, setNfts] = useState<any[]>([]);
  const { address, isConnected } = useAccount();
  
  const { data: userNFTCount, refetch: refetchUserNFTCount } = useReadContract({
    address: houseAssetAddress,
    abi: HouseAssetABI,
    functionName: 'balanceOf',
    args: [address],
  });

  useEffect(() => {
    const fetchNFTData = async () => {
      if (userNFTCount) {
        const promises = [];
        for (let i = 0; i < Number(userNFTCount); i++) {
          promises.push(
            (async () => {
              const { data: tokenId } = await useReadContract({
                address: houseAssetAddress,
                abi: HouseAssetABI,
                functionName: 'tokenOfOwnerByIndex',
                args: [address, i],
              });
              const { data: tokenURI } = await useReadContract({
                address: houseAssetAddress,
                abi: HouseAssetABI,
                functionName: 'tokenIdToURI',
                args: [tokenId],
              });
              const { data: ownerAddress } = await useReadContract({
                address: houseAssetAddress,
                abi: HouseAssetABI,
                functionName: 'ownerOf',
                args: [tokenId],
              });
              return { tokenId, tokenURI, ownerAddress };
            })()
          );
        }
        const results = await Promise.all(promises);
        setNfts(results);
      }
    };
    fetchNFTData();
  }, [userNFTCount, address]);

  const { writeContract: mintNFT, data: mintData } = useWriteContract();
  const { writeContract: stakeNFT, data: stakeData } = useWriteContract();
  const { writeContract: withdraw, data: withdrawData } = useWriteContract();
  const { writeContract: approveNFT, data: approveData } = useWriteContract();

  const { isLoading: isMinting, isSuccess: isMinted } = useWaitForTransactionReceipt({ hash: mintData });
  const { isLoading: isStaking, isSuccess: isStaked } = useWaitForTransactionReceipt({ hash: stakeData });
  const { isLoading: isWithdrawing, isSuccess: isWithdrawn } = useWaitForTransactionReceipt({ hash: withdrawData });
  const { isLoading: isApproving, isSuccess: isApproved } = useWaitForTransactionReceipt({ hash: approveData });

  const handleMintNFT = async (houseOwner: string, houseURI: string) => {
    try {
      await mintNFT({
        address: houseAssetAddress,
        abi: HouseAssetABI,
        functionName: 'airdrop',
        args: [houseOwner, houseURI],
      });
    } catch (error) {
      console.error('Minting failed:', error);
      Swal.fire('Error', `Minting failed: ${error}`, 'error');
    }
  };

  const handleWithdraw = async (tokenId: number, isNFT: boolean) => {
    try {
      await withdraw({
        address: etheRealAddress,
        abi: EtheRealABI,
        functionName: isNFT ? 'withdrawNFT' : 'withdrawETH',
        args: [tokenId],
      });
    } catch (error) {
      console.error('Withdrawal failed:', error);
      Swal.fire('Error', `Withdrawal failed: ${error}`, 'error');
    }
  };

  useEffect(() => {
    if (isMinted || isStaked || isWithdrawn || isApproved) {
      Swal.fire({
        title: 'Transaction Successful!',
        icon: 'success',
      });
      refetchUserNFTCount();
    }
  }, [isMinted, isStaked, isWithdrawn, isApproved, refetchUserNFTCount]);

  if (!isConnected) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-2xl text-gray-800">請連接錢包查看管理你的房地產</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 flex">
      <div className="w-1/2 pr-4">
        <h1 className="text-4xl font-bold mb-8 text-gray-900">管理房地產 NFT</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <button onClick={() => setShowMintModal(true)} className="btn-primary text-gray-800 bg-white border-gray-300">
            鑄造
          </button>
          <button onClick={() => setShowStakeModal(true)} className="btn-primary text-gray-800 bg-white border-gray-300">
            質押
          </button>
          <button onClick={() => setShowWithdrawModal(true)} className="btn-primary text-gray-800 bg-white border-gray-300">
            提領
          </button>
        </div>
        <MintNFTModal show={showMintModal} handleClose={() => setShowMintModal(false)} mintNFT={handleMintNFT} />
        <StakeNFTModal show={showStakeModal} handleClose={() => setShowStakeModal(false)} />
        <WithdrawModal show={showWithdrawModal} handleClose={() => setShowWithdrawModal(false)} withdraw={handleWithdraw} />
        <div className="mt-8">
          <h2 className="text-4xl font-bold mb-4 text-gray-900">你的房地產 NFT</h2>
          <div>
            {nfts.map((nft, index) => (
              nft.ownerAddress === address && (
                <TokenImage key={index} tokenURI={nft.tokenURI} tokenId={nft.tokenId} ownerAddress={nft.ownerAddress} />
              )
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Add additional NFT details or components here if needed */}
          </div>
        </div>
      </div>
      <div className="w-1/2 pl-4 flex items-center justify-center">
        <Image
          src="/whitehouse.webp"
          alt="Your image description"
          width={600}
          height={1500}
          className="object-cover"
        />
      </div>
    </div>
  );
}
