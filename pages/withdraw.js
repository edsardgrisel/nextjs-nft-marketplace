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
    const marketplaceAddress = process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT_ADDRESS
    const dispatch = useNotification()
    const [proceeds, setProceeds] = useState("0")

    const { runContractFunction } = useWeb3Contract()

    async function withdraw(data) {
        console.log("Withdrawing...")
        const amountToWithdraw = ethers.utils
            .parseUnits(data.data[0].inputResult, "ether")
            .toString()

        const withdrawOptions = {
            abi: nftMarketplaceAbi,
            contractAddress: marketplaceAddress,
            functionName: "withdraw",
            params: {
                amount: amountToWithdraw,
            },
        }

        await runContractFunction({
            params: withdrawOptions,
            onSuccess: () => handleWithdrawSuccess(amountToWithdraw),
            onError: (error) => {
                console.log(error)
            },
        })
    }

    const handleWithdrawSuccess = (amountToWithdraw) => {
        dispatch({
            type: "success",
            message: "Withdrawing " + ethers.utils.formatUnits(amountToWithdraw) + " ETH.",
            position: "topR",
        })
    }

    async function setupUI() {
        const returnedProceeds = await runContractFunction({
            params: {
                abi: nftMarketplaceAbi,
                contractAddress: marketplaceAddress,
                functionName: "getBalance",
                params: {
                    user: account,
                },
            },
            onError: (error) => console.log(error),
        })
        if (returnedProceeds) {
            setProceeds(ethers.utils.formatUnits(returnedProceeds, "ether"))
        }
    }

    useEffect(() => {
        setupUI()
    }, [proceeds, account, isWeb3Enabled, chainId])

    return (
        <div className={styles.container}>
            <Form
                onSubmit={withdraw}
                data={[
                    {
                        name: "Amount to withdraw",
                        type: "number",
                        inputWidth: "50%",
                        value: "",
                        key: "amountToWithdraw",
                    },
                ]}
                title={"Withdraw" + " (Current balance is " + proceeds + " ETH)"}
                id="Main Form"
            />
        </div>
    )
}
