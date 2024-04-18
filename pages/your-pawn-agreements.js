import Head from "next/head"
import Image from "next/image"
import styles from "../styles/Home.module.css"
import { Form, useNotification, Button } from "web3uikit"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { ethers } from "ethers"
import nftAbi from "../constants/nftAbi.json"
import nftMarketplaceAbi from "../constants/marketplaceAbi.json"
import { useEffect, useState } from "react"
import PawnAgreementBox from "../components/PawnAgreementBox"
import { useQuery } from "@apollo/client"
import { GET_PAWN_AGREEMENT } from "../constants/subgraphQueries"

export default function Home() {
    const { chainId, account, isWeb3Enabled } = useMoralis()
    const marketplaceAddress = process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT_ADDRESS
    const dispatch = useNotification()
    const [pawnAgreement, setPawnAgreement] = useState("0")
    const {
        loading: pawnAgreementLoading,
        error: pawnAgreementError,
        data: pawnAgreements,
    } = useQuery(GET_PAWN_AGREEMENT, {
        variables: { userId: account },
    })

    const { runContractFunction } = useWeb3Contract()

    async function setupUI() {
        const returnedpawnAgreement = await runContractFunction({
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
        if (returnedpawnAgreement) {
            setPawnAgreement(returnedpawnAgreement)
        }
    }

    useEffect(() => {
        setupUI()
    }, [pawnAgreement, account, isWeb3Enabled, chainId])

    return (
        <div className="py-4 px-4" style={{ border: "1px solid black" }}>
            <h1 className="py-4 px-4 font-bold text-2xl">Your Loan Agreement</h1>
            <div className="flex flex-wrap">
                {isWeb3Enabled && chainId ? (
                    pawnAgreementLoading || !pawnAgreements ? (
                        <div>Loading...</div>
                    ) : (
                        pawnAgreements.activePawnAgreements.map((nft) => {
                            const {
                                nftAddress,
                                tokenId,
                                borrower,
                                lender,
                                loanAmount,
                                loanDuration,
                                interestRate,
                                blockTimestamp,
                            } = nft
                            return marketplaceAddress ? (
                                <PawnAgreementBox
                                    loanAmount={loanAmount}
                                    nftAddress={nftAddress}
                                    tokenId={tokenId}
                                    marketplaceAddress={marketplaceAddress}
                                    borrower={borrower}
                                    lender={lender}
                                    interestRate={interestRate}
                                    loanDuration={loanDuration}
                                    blockTimestamp={blockTimestamp}
                                    key={`${nftAddress}${tokenId}`}
                                />
                            ) : (
                                <div>Network error, please switch to a supported network. </div>
                            )
                        })
                    )
                ) : (
                    <div>Web3 Currently Not Enabled</div>
                )}
            </div>
        </div>
    )
}
