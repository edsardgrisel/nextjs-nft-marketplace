import { Modal, Card, Input, useNotification } from "web3uikit"
import { useState } from "react"
import { useWeb3Contract } from "react-moralis"
import nftMarketplaceAbi from "../constants/marketplaceAbi.json"
import { ethers } from "ethers"
import Image from "next/image"

export default function ForecloseOnLoanModal({
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
    marketplaceAddress,
    nftAddress,
    onClose,
}) {
    return (
        <Modal
            isVisible={isVisible}
            onCancel={onClose}
            onCloseButtonPressed={onClose}
            onOk={onClose}
        >
            <Card>This is feature has not been implemented yet.</Card>
        </Modal>
    )
}
