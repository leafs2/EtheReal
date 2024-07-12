# EtheReal 不動產投資租賃平台  / EtheReal Real Estate Investment and Rental Platform

## 簡介 / Introduction

EtheReal 是一個基於以太坊的智能合約生態系統，用於管理房地產資產的代幣化、投資和租賃。它由三個主要合約組成：EtheReal、HouseToken 和 HouseAsset。

EtheReal is an Ethereum-based smart contract ecosystem for managing tokenized real estate assets, investments, and rentals. It consists of three main contracts: EtheReal, HouseToken, and HouseAsset.

## 合約概述 / Contract Overview

### 1. EtheReal

主合約，管理 NFT 的代幣化、投資和租賃流程。

The main contract that manages the tokenization, investment, and rental processes for NFTs.

主要功能 / Main Features:
- NFT 代幣化 / NFT Tokenization
- 代幣購買 / Token Purchase
- 房產租賃 / Property Rental
- 收益分配 / Profit Distribution
- NFT 贖回 / NFT Redemption

### 2. HouseToken

為每個代幣化的房產 NFT 創建 ERC20 代幣。

Creates ERC20 tokens for each tokenized real estate NFT.

主要功能 / Main Features:
- 代幣鑄造 / Token Minting
- 代幣銷毀 / Token Burning
- 最大供應量限制 / Maximum Supply Limit

### 3. HouseAsset

管理表示房地產資產的 ERC721 代幣（NFTs）。

Manages ERC721 tokens (NFTs) representing real estate assets.

主要功能 / Main Features:
- NFT 鑄造（空投） / NFT Minting (Airdrop)
- 代幣 URI 管理 / Token URI Management


## 使用流程 / Usage Flow

1. 部署 HouseAsset 合約，創建代表房地產的 NFTs。
   Deploy the HouseAsset contract to create NFTs representing real estate.

2. 部署 EtheReal 合約，將 HouseAsset 合約地址作為參數傳入。
   Deploy the EtheReal contract, passing the HouseAsset contract address as a parameter.

3. 房產所有者通過 EtheReal 合約的 `stakeNFT` 函數將其 NFT 代幣化。這會創建一個新的 HouseToken 合約實例。
   Property owners tokenize their NFTs through the `stakeNFT` function in the EtheReal contract. This creates a new HouseToken contract instance.

4. 投資者可以使用 `buyTokens` 函數購買特定房產的代幣。
   Investors can purchase tokens for specific properties using the `buyTokens` function.

5. 用戶可以通過 `rentHouse` 函數租用房產。
   Users can rent properties using the `rentHouse` function.

6. 代幣持有者可以在租賃期結束後使用 `burnForETH` 函數兌換其代幣。
   Token holders can redeem their tokens using the `burnForETH` function after the rental period.

7. NFT 所有者可以在滿足條件時使用 `withdrawNFT` 函數取回其 NFT。
   NFT owners can retrieve their NFT using the `withdrawNFT` function when conditions are met.

## 安全考慮 / Security Considerations

1. 這些合約使用 OpenZeppelin 的標準合約庫，提高了安全性和可靠性。
   These contracts use OpenZeppelin's standard contract libraries, enhancing security and reliability.

2. 所有關鍵函數都有訪問控制，只有合約所有者或特定角色可以執行某些操作。
   All critical functions have access control, allowing only the contract owner or specific roles to perform certain actions.

3. 在 HouseToken 合約中實施了最大供應量限制，以防止過度鑄造。
   A maximum supply limit is implemented in the HouseToken contract to prevent over-minting.

4. 在將這些合約部署到主網之前，強烈建議進行全面的安全審計。
   A comprehensive security audit is strongly recommended before deploying these contracts to the mainnet.

## 免責聲明 / Disclaimer

這個智能合約生態系統僅用於演示目的。在將其用於任何實際應用之前，請確保您完全理解其功能、相互作用和潛在風險。

This smart contract ecosystem is for demonstration purposes only. Ensure you fully understand its functions, interactions, and potential risks before using it for any real-world applications.
