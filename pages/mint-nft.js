import Head from "next/head"
import Image from "next/image"
import styles from "../styles/Home.module.css"
import { Form, useNotification, Button } from "web3uikit"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { ethers } from "ethers"
import nftAbi from "../constants/nftAbi.json"
import nftMarketplaceAbi from "../constants/marketplaceAbi.json"
import { useEffect, useState } from "react"

export default function Home() {
    const { chainId, account, isWeb3Enabled } = useMoralis()
    const nftAddress = process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS
    const dispatch = useNotification()

    const { runContractFunction } = useWeb3Contract()
    const [nftTokenCounter, setNftTokenCounter] = useState()

    async function mintNft() {
        console.log("Minting...")

        const getTokenCounterOptions = {
            abi: nftAbi,
            contractAddress: "0x1cfc0972EA05216D7d787A6Fa96E817B094F29F9",
            functionName: "getTokenCounter",
        }

        await runContractFunction({
            params: getTokenCounterOptions,
            onSuccess: (data) => setNftTokenCounter(parseInt(data._hex)),
            onError: (error) => {
                console.log(error)
            },
        })

        const mintOptions = {
            abi: nftAbi,
            contractAddress: "0x1cfc0972EA05216D7d787A6Fa96E817B094F29F9",
            functionName: "mintNft",
            params: {
                tokenUri: "ipfs://QmdryoExpgEQQQgJPoruwGJyZmz6SqV4FRTX1i73CT3iXn",
            },
        }

        await runContractFunction({
            params: mintOptions,
            onSuccess: () => handleMintSuccess(),
            onError: (error) => {
                console.log(error)
            },
        })
    }

    const handleMintSuccess = () => {
        dispatch({
            type: "success",
            message: "Minted NFT!",
            position: "topR",
        })
    }

    return (
        <div>
            <button style={{ border: "1px solid black" }} onClick={mintNft}>
                Click To Mint NFT
            </button>

            <div>Nft address: 0x1cfc0972EA05216D7d787A6Fa96E817B094F29F9</div>
            <div>Nft id: {nftTokenCounter}</div>
            <div>
                Save these for interacting with the app. You can import this nft to your metamask
            </div>
        </div>
    )
}
