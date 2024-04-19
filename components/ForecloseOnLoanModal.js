import { Modal, Card, Input, useNotification } from "web3uikit"
import { useState } from "react"
import { useWeb3Contract } from "react-moralis"
import nftMarketplaceAbi from "../constants/marketplaceAbi.json"
import { ethers } from "ethers"
import Image from "next/image"

export default function RepayLoanModal({
    isVisible,
    tokenId,
    tokenName,
    tokenDescription,
    imageURI,
    loanAmount,
    loanDuration,
    interestRate,
    amountToRepay,
    borrower,
    lender,
    marketplaceAddress,
    nftAddress,
    onClose,
}) {
    const dispatch = useNotification()

    const handleForecloseSuccess = () => {
        dispatch({
            type: "success",
            message: "You successfully foreclosed on the loan!",
            title: "Foreclosed",
            position: "topR",
        })
        onClose && onClose()
    }

    const { runContractFunction: foreclosePawnAgreement } = useWeb3Contract({
        abi: nftMarketplaceAbi,
        contractAddress: marketplaceAddress,
        functionName: "foreclosePawnAgreement",
        params: {},
    })

    return (
        <Modal
            isVisible={isVisible}
            onCancel={onClose}
            onCloseButtonPressed={onClose}
            onOk={() => {
                repayLoan({
                    onError: (error) => {
                        console.log(error)
                    },
                    onSuccess: () => handleRepaySuccessful(),
                })
            }}
        >
            <Card>
                <div className="p-2">
                    <div className="flex flex-col items-center gap-2">
                        <div style={{ fontWeight: "bold", fontSize: "larger" }}>
                            Are you sure you want to foreclose on this loan?
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
                                <li>Lender: {lender}</li>
                                <li>Borrower: {borrower}</li>
                                <li>Loan Amount: {ethers.utils.formatEther(loanAmount)} ETH</li>

                                <li>Loan Duration: {loanDuration / 86400} days</li>
                                <li>
                                    Annual Interest Rate:
                                    {(interestRate * 100) / 1e18}%
                                </li>

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
