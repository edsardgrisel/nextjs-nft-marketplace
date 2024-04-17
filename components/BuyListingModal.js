import { Modal, Card, Input, useNotification } from "web3uikit"
import { useState } from "react"
import { useWeb3Contract } from "react-moralis"
import nftMarketplaceAbi from "../constants/marketplaceAbi.json"
import { ethers } from "ethers"
import Image from "next/image"

export default function BuyListingModal({
    nftAddress,
    tokenId,
    tokenName,
    tokenDescription,
    imageURI,
    price,
    isVisible,
    marketplaceAddress,
    onClose,
}) {
    const dispatch = useNotification()

    const handleBuyListingSuccess = () => {
        dispatch({
            type: "success",
            message: "You successfully purchased an NFT!",
            title: "Nft Purchased",
            position: "topR",
        })
        onClose && onClose()
    }

    const { runContractFunction: buyListing } = useWeb3Contract({
        abi: nftMarketplaceAbi,
        contractAddress: marketplaceAddress,
        functionName: "buyNft",
        msgValue: price,
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
            <Card title={tokenName} description={tokenDescription}>
                <div className="p-2">
                    <div className="flex flex-col items-center gap-2">
                        <div style={{ fontWeight: "bold", fontSize: "larger" }}>
                            Are you sure you want to purchase nft #{tokenId} for $
                            {ethers.utils.formatEther(price)} ETH?
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
                        <div className="font-bold"></div>
                    </div>
                </div>
            </Card>
        </Modal>
    )
}
