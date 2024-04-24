import { Modal, Card, Input, useNotification } from "web3uikit"
import { useState } from "react"
import { useWeb3Contract } from "react-moralis"
import nftMarketplaceAbi from "../constants/marketplaceAbi.json"
import { ethers } from "ethers"
import Image from "next/image"

export default function ApprovePawnRequestModal({
    isVisible,
    tokenId,
    tokenName,
    tokenDescription,
    imageURI,
    loanAmount,
    loanDuration,
    interestRate,
    borrower,
    marketplaceAddress,
    nftAddress,
    onClose,
}) {
    const dispatch = useNotification()

    const handleBuyListingSuccess = () => {
        dispatch({
            type: "success",
            message: "You successfully loaned out some ETH!",
            title: "ETH Loaned out",
            position: "topR",
        })
        onClose && onClose()
    }

    const { runContractFunction: buyListing } = useWeb3Contract({
        abi: nftMarketplaceAbi,
        contractAddress: marketplaceAddress,
        functionName: "approvePawnRequest",
        msgValue: loanAmount,
        params: {
            nftAddress: nftAddress,
            tokenId: tokenId,
        },
    })

    return (
        <Modal
            isVisible={isVisible}
            onCancel={onClose}
            onCloseButtonPressed={onClose}
            onOk={() => {
                buyListing({
                    onError: (error) => {
                        console.log(error)
                    },
                    onSuccess: () => handleBuyListingSuccess(),
                })
            }}
        >
            <Card>
                <div className="p-2">
                    <div className="flex flex-col items-center gap-2">
                        <div style={{ fontWeight: "bold", fontSize: "larger" }}>
                            Are you sure you want to approve this loan?
                        </div>
                        <div style={{ fontSize: "smaller", color: "red" }}>
                            Warning!: The borrower may default and you may lose the loan amount. In
                            this case you will be able to claim the collateral token.
                        </div>
                        <div style={{ display: "flex", justifyContent: "center" }}>
                            Collateral token: {tokenName} #{tokenId}
                        </div>
                        <div style={{ display: "flex", justifyContent: "center" }}>
                            {" "}
                            <Image
                                loader={() => imageURI}
                                src={imageURI}
                                height="200"
                                width="200"
                            />
                        </div>
                        <div>
                            <ul>
                                <li>
                                    Loan Amount: {ethers.utils.formatUnits(loanAmount, "ether")}{" "}
                                    ETH
                                </li>
                                <li>Loan Duration: {loanDuration / 86400} days</li>
                                <li>Annual Interest Rate: {(interestRate * 100) / 1e18}%</li>
                                <li>Borrower: {borrower}</li>
                                <li>Token ID: {tokenId}</li>
                                <li>
                                    Nft Project Sepolia Etherscan:{" "}
                                    <a
                                        href={"https://sepolia.etherscan.io/address/" + nftAddress}
                                        style={{ textDecoration: "underline", color: "blue" }}
                                    >
                                        {"https://sepolia.etherscan.io/address/" + nftAddress}
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div className="font-bold"></div>
                    </div>
                </div>
            </Card>
        </Modal>
    )
}
