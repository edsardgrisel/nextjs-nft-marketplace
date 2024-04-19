import { Modal, Card, Input, useNotification } from "web3uikit"
import { useState } from "react"
import { useWeb3Contract } from "react-moralis"
import nftMarketplaceAbi from "../constants/marketplaceAbi.json"
import { ethers } from "ethers"
import Image from "next/image"

export default function TooEarlyToForecloseOnLoanModal({
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

    return (
        <Modal
            isVisible={isVisible}
            onCancel={onClose}
            onCloseButtonPressed={onClose}
            onOk={onClose}
        >
            Insufficient time has passed to foreclose on this loan. Please wait until the loan
            duration has passed.
        </Modal>
    )
}
