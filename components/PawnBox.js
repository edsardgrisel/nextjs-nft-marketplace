import { useState, useEffect } from "react"
import { useWeb3Contract, useMoralis } from "react-moralis"
import nftAbi from "../constants/nftAbi.json"
import Image from "next/image"
import { Card, useNotification } from "web3uikit"
import { ethers } from "ethers"
import RemovePawnRequestModal from "./RemovePawnRequestModal"
import BuyListingModal from "./BuyListingModal"
import ApprovePawnRequestModal from "./ApprovePawnRequestModal"

const truncateStr = (fullStr, strLen) => {
    if (fullStr.length <= strLen) return fullStr

    const separator = "..."
    const seperatorLength = separator.length
    const charsToShow = strLen - seperatorLength
    const frontChars = Math.ceil(charsToShow / 2)
    const backChars = Math.floor(charsToShow / 2)
    return (
        fullStr.substring(0, frontChars) +
        separator +
        fullStr.substring(fullStr.length - backChars)
    )
}

export default function PawnBox({
    loanAmount,
    loanDuration,
    interestRate,
    nftAddress,
    tokenId,
    marketplaceAddress,
    borrower,
}) {
    const { isWeb3Enabled, account } = useMoralis()
    const [imageURI, setImageURI] = useState("")
    const [tokenName, setTokenName] = useState("")
    const [tokenDescription, setTokenDescription] = useState("")

    const [showApprovePawnRequestModal, setShowApprovePawnRequestModal] = useState(false)
    const hideApprovePawnRequestModal = () => setShowApprovePawnRequestModal(false)

    const [showRemovePawnRequestModal, setShowRemovePawnRequestModal] = useState(false)
    const hideRemovePawnRequestModal = () => setShowRemovePawnRequestModal(false)

    const dispatch = useNotification()

    const { runContractFunction: getTokenURI } = useWeb3Contract({
        abi: nftAbi,
        contractAddress: nftAddress,
        functionName: "tokenURI",
        params: {
            tokenId: tokenId,
        },
    })

    async function updateUI() {
        const tokenURI = await getTokenURI()
        console.log(`The TokenURI is ${tokenURI}`)
        // We are going to cheat a little here...
        if (tokenURI) {
            // IPFS Gateway: A server that will return IPFS files from a "normal" URL.

            const requestURL = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/")
            const tokenURIResponse = await (await fetch(requestURL)).json()
            const imageURI = tokenURIResponse.image
            const imageURIURL = imageURI.replace("ipfs://", "https://ipfs.io/ipfs/")
            setImageURI(imageURIURL)
            setTokenName(tokenURIResponse.name)
            setTokenDescription(tokenURIResponse.description)
            // We could render the Image on our sever, and just call our sever.
            // For testnets & mainnet -> use moralis server hooks
            // Have the world adopt IPFS
            // Build our own IPFS gateway
        }
        // get the tokenURI
        // using the image tag from the tokenURI, get the image
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI()
        }
    }, [isWeb3Enabled])

    const isOwnedByUser = borrower === account || borrower === undefined
    const formattedSellerAddress = isOwnedByUser ? "you" : truncateStr(borrower || "", 15)

    const handleCardClick = () => {
        console.log("hello")
        isOwnedByUser ? setShowRemovePawnRequestModal(true) : setShowApprovePawnRequestModal(true)
    }

    return (
        <div>
            <div>
                {imageURI ? (
                    <div>
                        <RemovePawnRequestModal
                            nftAddress={nftAddress}
                            tokenId={tokenId}
                            isVisible={showRemovePawnRequestModal}
                            imageURI={imageURI}
                            marketplaceAddress={marketplaceAddress}
                            onClose={hideRemovePawnRequestModal}
                        />
                        <ApprovePawnRequestModal
                            isVisible={showApprovePawnRequestModal}
                            tokenId={tokenId}
                            tokenName={tokenName}
                            tokenDescription={tokenDescription}
                            imageURI={imageURI}
                            loanAmount={loanAmount}
                            loanDuration={loanDuration}
                            interestRate={interestRate}
                            borrower={borrower}
                            marketplaceAddress={marketplaceAddress}
                            nftAddress={nftAddress}
                            onClose={hideApprovePawnRequestModal}
                        />
                        <Card
                            title={tokenName}
                            description={tokenDescription}
                            onClick={handleCardClick}
                        >
                            <div className="p-2">
                                <div className="flex flex-col items-end gap-2">
                                    <div>#{tokenId}</div>
                                    <div className="italic text-sm">
                                        Owned by {formattedSellerAddress}
                                    </div>
                                    <Image
                                        loader={() => imageURI}
                                        src={imageURI}
                                        height="200"
                                        width="200"
                                    />
                                    <div className="font-bold">
                                        <ul>
                                            <li>
                                                Loan Amount:{" "}
                                                {ethers.utils.formatUnits(loanAmount, "ether")} ETH
                                            </li>
                                            <li>Loan Duration:{loanDuration / 86400} days</li>
                                            <li>
                                                Annual Interest Rate:
                                                {(interestRate * 100) / 1e18}%
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                ) : (
                    <div>Loading...</div>
                )}
            </div>
        </div>
    )
}
