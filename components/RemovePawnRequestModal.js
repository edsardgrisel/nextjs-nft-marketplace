import { Modal, Input, useNotification } from "web3uikit"
import { useState } from "react"
import { useWeb3Contract } from "react-moralis"
import nftMarketplaceAbi from "../constants/marketplaceAbi.json"
import { ethers } from "ethers"

export default function UpdatePawnRequestModal({
    nftAddress,
    tokenId,
    isVisible,
    imageUri,
    marketplaceAddress,
    onClose,
}) {
    const dispatch = useNotification()

    const handleUpdateListingSuccess = () => {
        dispatch({
            type: "success",
            message: "Please refresh",
            title: "Pawn request removed",
            position: "topR",
        })
        onClose && onClose()
        setPriceToUpdateListingWith("0")
    }

    const { runContractFunction: updateListing } = useWeb3Contract({
        abi: nftMarketplaceAbi,
        contractAddress: marketplaceAddress,
        functionName: "removePawnRequest",
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
                updateListing({
                    onError: (error) => {
                        console.log(error)
                    },
                    onSuccess: () => handleUpdateListingSuccess(),
                })
            }}
        >
            <div className="flex flex-col items-center gap-2">
                Do you want to remove pawn request
            </div>
        </Modal>
    )
}
