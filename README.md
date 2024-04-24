# Nft marketplace frontend

## Overview

This NFT Marketplace application enables users to buy, sell, and pawn NFTs, using them as collateral for collateralized loans. The front end is built with Next.js, while the smart contracts are developed with Foundry. Data interactions with the blockchain are handled via The Graph. The demo contract is deployed on the Sepolia testnet.

The smart contracts can be found at https://github.com/edsardgrisel/nft-marketplace with a more technical readme.
The graph subgraph can be found at https://github.com/edsardgrisel/graph-nft-marketplace.

**Smart Contract Address (Sepolia):** `0xCBf08181c60507fd69643c40B5fAcEba514FFD23`

## Demo

You can view a demo of the application [here](https://www.youtube.com/watch?v=HK4oXhecKvE).

## Prerequisites

Before you begin, ensure you have met the following requirements:

* You have installed the latest version of Node.js and Yarn.
* I ran this on windows 10 with wsl and I am not sure if it will work on other setups.

## Installing 

To install <Application Name>, follow these steps:

1. Clone the repository: `git clone https://github.com/edsardgrisel/nextjs-nft-marketplace`
2. Add a .env file in the root directory with the following variables:
```NEXT_PUBLIC_SUBGRAPH_URL="https://api.studio.thegraph.com/query/70180/nft-marketplace/version/latest"
NEXT_PUBLIC_SUBGRAPH_URL="https://api.studio.thegraph.com/query/70180/nft-marketplace/version/latest"
NEXT_PUBLIC_MARKETPLACE_CONTRACT_ADDRESS="0xCBf08181c60507fd69643c40B5fAcEba514FFD23"
NEXT_PUBLIC_NFT_CONTRACT_ADDRESS="0x1cfc0972EA05216D7d787A6Fa96E817B094F29F9"
SEPOLIA_RPC_URL="https://eth-sepolia.g.alchemy.com/v2/..." (your own rpc url)
```
3. Save the .env file and run `source .env` in the terminal.
4. Install the dependencies: `npm install`

## Running 

To run the marketplace front end, follow these steps:

1. Start the development server: `yarn run dev`
2. Connect your sepolia testnet wallet to the application and you can now buy, sell and pawn nfts.
3. There is a mintnft page where you can mint nfts to interact with the app.


