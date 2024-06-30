import React, { useState, useEffect } from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { houseAssetAddress } from '@/contract/address/houseAssetAddress';
import { etheRealAddress } from '@/contract/address/etheRealAddress';
import { HouseAssetABI } from '@/contract/abi/HouseAsset';
import { EtheRealABI } from '@/contract/abi/EtheReal';
import Swal from 'sweetalert2';
import { parseEther } from 'ethers';

interface StakeNFTModalProps {
  show: boolean;
  handleClose: () => void;
}

export function StakeNFTModal({ show, handleClose }: StakeNFTModalProps) {
  const [tokenId, setTokenId] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [months, setMonths] = useState('');
  const [pricePerToken, setPricePerToken] = useState('');
  const [totalSupply, setTotalSupply] = useState('');
  const [rentPricePerMonth, setRentPricePerMonth] = useState('');
  const [isApproved, setIsApproved] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const { writeContract: approveNFT, data: approveData } = useWriteContract();
  const { writeContract: stakeNFT, data: stakeData } = useWriteContract();

  const { isLoading: isApproving, isSuccess: isApproveSuccess } = useWaitForTransactionReceipt({ hash: approveData });
  const { isLoading: isStaking, isSuccess: isStakeSuccess } = useWaitForTransactionReceipt({ hash: stakeData });

  useEffect(() => {
    if (isApproveSuccess) {
      setIsApproved(true);
      Swal.fire('Success', 'NFT approved for transfer', 'success');
    }
  }, [isApproveSuccess]);

  useEffect(() => {
    if (isStakeSuccess) {
      Swal.fire('Success', 'NFT 質押成功', 'success');
      handleClose();
    }
  }, [isStakeSuccess, handleClose]);

  useEffect(() => {
    setIsApproved(false);
  }, [tokenId]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!tokenId) newErrors.tokenId = "Token ID is required";
    if (!startTime) newErrors.startTime = "Start time is required";
    if (!endTime) newErrors.endTime = "End time is required";
    if (!minAmount) newErrors.minAmount = "Minimum amount is required";
    if (!months) newErrors.months = "Number of months is required";
    if (!pricePerToken) newErrors.pricePerToken = "Price per token is required";
    if (!totalSupply) newErrors.totalSupply = "Total supply is required";
    if (!rentPricePerMonth) newErrors.rentPricePerMonth = "Rent price per month is required";

    if (new Date(endTime) <= new Date(startTime)) {
      newErrors.endTime = "End time must be after start time";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleApprove = async () => {
    if (!tokenId) {
      setErrors({ ...errors, tokenId: 'Please enter a valid Token ID' });
      return;
    }
    try {
      await approveNFT({
        address: houseAssetAddress,
        abi: HouseAssetABI,
        functionName: 'approve',
        args: [etheRealAddress, BigInt(tokenId)],
      });
    } catch (error) {
      console.error('Approval failed:', error);
      Swal.fire('Error', `Approval failed: ${error}`, 'error');
    }
  };

  const handleStake = async () => {
    if (!validateForm()) {
      Swal.fire('Error', "Please fill in all fields correctly", 'error');
      return;
    }

    if (!isApproved) {
      Swal.fire('Error', "Please approve the NFT transfer first.", 'error');
      return;
    }

    try {
      const startTimeUnix = Math.floor(new Date(startTime).getTime() / 1000);
      const endTimeUnix = Math.floor(new Date(endTime).getTime() / 1000);

      await stakeNFT({
        address: etheRealAddress,
        abi: EtheRealABI,
        functionName: 'stakeNFT',
        args: [
          BigInt(tokenId),
          BigInt(startTimeUnix),
          BigInt(endTimeUnix),
          BigInt(minAmount),
          BigInt(months),
          parseEther(pricePerToken),
          BigInt(totalSupply),
          parseEther(rentPricePerMonth)
        ],
      });
    } catch (error) {
      console.error('Staking failed:', error);
      let errorMessage = 'Staking failed';
      if (error && typeof error === 'object' && 'message' in error) {
        errorMessage += `: ${error.message}`;
      }
      Swal.fire('Error', errorMessage, 'error');
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">質押 NFT</h2>
          <FontAwesomeIcon
            icon={faXmark}
            className="cursor-pointer text-gray-900"
            onClick={handleClose}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Token ID</label>
          <input
            type="number"
            placeholder="Enter Token ID"
            className={`w-full p-2 border rounded ${errors.tokenId ? 'border-red-500' : 'border-gray-300'}`}
            value={tokenId}
            onChange={(e) => setTokenId(e.target.value)}
          />
          {errors.tokenId && <p className="text-red-500 text-xs mt-1">{errors.tokenId}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">開始時間</label>
          <input
            type="datetime-local"
            className={`w-full p-2 border rounded ${errors.startTime ? 'border-red-500' : 'border-gray-300'}`}
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
          {errors.startTime && <p className="text-red-500 text-xs mt-1">{errors.startTime}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">結束時間</label>
          <input
            type="datetime-local"
            className={`w-full p-2 border rounded ${errors.endTime ? 'border-red-500' : 'border-gray-300'}`}
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
          {errors.endTime && <p className="text-red-500 text-xs mt-1">{errors.endTime}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            最小數量
            <FontAwesomeIcon icon={faInfoCircle} className="ml-1 text-gray-500" title="Minimum investment amount in ETH" />
          </label>
          <input
            type="number"
            placeholder="e.g., 1"
            className={`w-full p-2 border rounded ${errors.minAmount ? 'border-red-500' : 'border-gray-300'}`}
            value={minAmount}
            onChange={(e) => setMinAmount(e.target.value)}
            step="0.0001"
          />
          {errors.minAmount && <p className="text-red-500 text-xs mt-1">{errors.minAmount}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">幾個月</label>
          <input
            type="number"
            placeholder="e.g., 12"
            className={`w-full p-2 border rounded ${errors.months ? 'border-red-500' : 'border-gray-300'}`}
            value={months}
            onChange={(e) => setMonths(e.target.value)}
          />
          {errors.months && <p className="text-red-500 text-xs mt-1">{errors.months}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            每個代幣的價格 (ETH)
            <FontAwesomeIcon icon={faInfoCircle} className="ml-1 text-gray-500" title="Price for each token in ETH" />
          </label>
          <input
            type="number"
            placeholder="e.g., 0.001"
            className={`w-full p-2 border rounded ${errors.pricePerToken ? 'border-red-500' : 'border-gray-300'}`}
            value={pricePerToken}
            onChange={(e) => setPricePerToken(e.target.value)}
            step="0.0001"
          />
          {errors.pricePerToken && <p className="text-red-500 text-xs mt-1">{errors.pricePerToken}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            總供應量  
            <FontAwesomeIcon icon={faInfoCircle} className="ml-1 text-gray-500" title="Total number of tokens to be minted" />
          </label>
          <input
            type="number"
            placeholder="e.g., 1000000"
            className={`w-full p-2 border rounded ${errors.totalSupply ? 'border-red-500' : 'border-gray-300'}`}
            value={totalSupply}
            onChange={(e) => setTotalSupply(e.target.value)}
          />
          {errors.totalSupply && <p className="text-red-500 text-xs mt-1">{errors.totalSupply}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            每月租金 (ETH)  
            <FontAwesomeIcon icon={faInfoCircle} className="ml-1 text-gray-500" title="Monthly rental price in ETH" />
          </label>
          <input
            type="number"
            placeholder="e.g., 0.5"
            className={`w-full p-2 border rounded ${errors.rentPricePerMonth ? 'border-red-500' : 'border-gray-300'}`}
            value={rentPricePerMonth}
            onChange={(e) => setRentPricePerMonth(e.target.value)}
            step="0.0001"
          />
          {errors.rentPricePerMonth && <p className="text-red-500 text-xs mt-1">{errors.rentPricePerMonth}</p>}
        </div>
        <button 
          onClick={handleApprove} 
          className="bg-gray-900 text-white py-2 px-4 rounded w-full mb-4 hover:bg-gray-700" 
          disabled={isApproved || isApproving}
        >
          {isApproved ? "已授權" : isApproving ? "授權中..." : "授權 NFT 轉移"}
        </button>
        <button 
          onClick={handleStake} 
          className="bg-gray-900 text-white py-2 px-4 rounded w-full hover:bg-gray-700" 
          disabled={!isApproved || isStaking}
        >
          {isStaking ? "質押中..." : "質押 NFT"}
        </button>
      </div>
    </div>
  );
}
