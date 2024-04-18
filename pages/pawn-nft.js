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

    async function approveAndList(data) {
        console.log("Approving...")
        const nftAddress = data.data[0].inputResult
        const tokenId = data.data[1].inputResult
        const loanAmount = ethers.utils.parseUnits(data.data[2].inputResult, "ether").toString()
        const interestRate = ethers.utils
            .parseUnits((data.data[3].inputResult / 100).toString(), "ether")
            .toString()
        const loanDuration = data.data[4].inputResult * 86400
        const loanDurationFixed = parseFloat(loanDuration.toFixed(15))

        const approveOptions = {
            abi: nftAbi,
            contractAddress: nftAddress,
            functionName: "approve",
            params: {
                to: marketplaceAddress,
                tokenId: tokenId,
            },
        }

        await runContractFunction({
            params: approveOptions,
            onSuccess: (tx) =>
                handleApproveSuccess(
                    tx,
                    nftAddress,
                    tokenId,
                    loanAmount,
                    interestRate,
                    loanDurationFixed,
                ),
            onError: (error) => {
                console.log(error)
            },
        })
    }

    async function handleApproveSuccess(
        tx,
        nftAddress,
        tokenId,
        loanAmount,
        interestRate,
        loanDuration,
    ) {
        console.log("Ok! Now time to list pawn request")

        await tx.wait()
        const listOptions = {
            abi: nftMarketplaceAbi,
            contractAddress: marketplaceAddress,
            functionName: "requestPawn",
            params: {
                nftAddress: nftAddress,
                tokenId: tokenId,
                loanAmount: loanAmount,
                interestRate: interestRate,
                loanDuration: loanDuration,
            },
        }

        await runContractFunction({
            params: listOptions,
            onSuccess: () => handleListSuccess(),
            onError: (error) => console.log(error),
        })
    }

    async function handleListSuccess() {
        dispatch({
            type: "success",
            message: "Waiting for someone to approve pawn request",
            title: "Pawn request listed",
            position: "topR",
        })
    }

    const handleWithdrawSuccess = () => {
        dispatch({
            type: "success",
            message: "Withdrawing proceeds",
            position: "topR",
        })
    }

    return (
        <div className={styles.container}>
            <Form
                onSubmit={approveAndList}
                data={[
                    {
                        name: "NFT Address",
                        type: "text",
                        inputWidth: "50%",
                        value: "",
                        key: "nftAddress",
                    },
                    {
                        name: "Token ID",
                        type: "number",
                        value: "",
                        key: "tokenId",
                    },
                    {
                        name: "Loan Amount (in ETH)",
                        type: "number",
                        value: "",
                        key: "loanAmount",
                    },
                    {
                        name: "Interest rate (in percent)",
                        type: "number",
                        value: "",
                        key: "interestRate",
                    },
                    {
                        name: "Loan duration (in days)",
                        type: "number",
                        value: "",
                        key: "loanDuration",
                    },
                ]}
                title="Pawn your NFT!"
                id="Main Form"
            />
        </div>
    )
}
