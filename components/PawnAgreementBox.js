import { useState, useEffect } from "react"
import { useWeb3Contract, useMoralis } from "react-moralis"
import nftAbi from "../constants/nftAbi.json"
import Image from "next/image"
import { Card, useNotification } from "web3uikit"
import { ethers } from "ethers"
import RemovePawnRequestModal from "./RemovePawnRequestModal"
import BuyListingModal from "./BuyListingModal"
import ApprovePawnRequestModal from "./ApprovePawnRequestModal"
import RepayLoanModal from "./RepayLoanModal"
import nftMarketplaceAbi from "../constants/marketplaceAbi.json"
import ForecloseOnLoanModal from "./ForecloseOnLoanModal"
import TooEarlyToForecloseOnLoanModal from "./TooEarlyToForecloseOnLoanModal"
import Web3 from "web3"

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

export default function PawnAgreementBox({
    loanAmount,
    loanDuration,
    interestRate,
    nftAddress,
    tokenId,
    marketplaceAddress,
    borrower,
    lender,
    blockTimestamp,
}) {
    const { isWeb3Enabled, account } = useMoralis()
    const [imageURI, setImageURI] = useState("")
    const [tokenName, setTokenName] = useState("")
    const [tokenDescription, setTokenDescription] = useState("")
    const [amountToRepay, setAmountToRepay] = useState(0)

    const [showForecloseOnLoanModal, setShowForecloseOnLoanModal] = useState(false)
    const hideForecloseOnLoanModal = () => setShowForecloseOnLoanModal(false)

    const [showRepayLoanModal, setShowRepayLoanModal] = useState(false)
    const hideRepayLoanModal = () => setShowRepayLoanModal(false)

    const [showTooEarlyToForecloseModal, setShowTooEarlyToForecloseModal] = useState(false)
    const hideTooEarlyToForecloseModal = () => setShowTooEarlyToForecloseModal(false)

    const [canForeclose, setCanForeclose] = useState(false)

    const dispatch = useNotification()

    const { runContractFunction: getTokenURI } = useWeb3Contract({
        abi: nftAbi,
        contractAddress: nftAddress,
        functionName: "tokenURI",
        params: {
            tokenId: tokenId,
        },
    })

    const { runContractFunction: calculateInterest } = useWeb3Contract({
        abi: nftMarketplaceAbi,
        contractAddress: marketplaceAddress,
        functionName: "calculateInterest",
        params: {
            loanAmount: loanAmount,
            interestRate: interestRate,
            startTime: blockTimestamp,
            endTime: Number(blockTimestamp) + Number(loanDuration),
        },
    })

    const providerUrl = process.env.SEPOLIA_RPC_URL
    const web3 = new Web3("https://eth-sepolia.g.alchemy.com/v2/5D1nLxy6RIof5VUVvACsElGpQOO1nKHI")

    async function getBlockTimestamp(blockNumber = "latest") {
        try {
            const block = await web3.eth.getBlock(blockNumber)
            return block.timestamp
        } catch (error) {
            console.error("Error fetching block:", error)
        }
    }

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
            const interest = await calculateInterest()
            setAmountToRepay(interest.add(loanAmount).toString())
            const timestamp = await getBlockTimestamp()
            setCanForeclose(Number(timestamp) >= Number(blockTimestamp) + Number(loanDuration))
            console.log("timestamp: " + timestamp)
            console.log("blockTimestamp: " + blockTimestamp)
            console.log("loanDuration: " + loanDuration)
            // console.log(Number(timestamp) >= Number(blockTimestamp) + Number(loanDuration))
            // console.log("interest: " + interest.toString())
            // console.log("loanAMont: " + loanAmount.toString())
            // console.log("loan Amount: " + loanAmount.toString())
            // console.log("interestRate: " + interestRate.toString())
            // console.log("start: " + blockTimestamp.toString())
            // console.log("end: " + (Number(blockTimestamp) + Number(loanDuration)).toString())
            // console.log("duration: " + loanDuration.toString())
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
        isOwnedByUser
            ? setShowRepayLoanModal(true)
            : canForeclose
              ? setShowForecloseOnLoanModal(true)
              : setShowTooEarlyToForecloseModal(true)
    }

    return (
        <div>
            <div>
                {imageURI ? (
                    <div>
                        <ForecloseOnLoanModal
                            isVisible={showForecloseOnLoanModal}
                            tokenId={tokenId}
                            tokenName={tokenName}
                            tokenDescription={tokenDescription}
                            imageURI={imageURI}
                            loanAmount={loanAmount}
                            loanDuration={loanDuration}
                            interestRate={interestRate}
                            amountToRepay={amountToRepay}
                            borrower={borrower}
                            lender={lender}
                            marketplaceAddress={marketplaceAddress}
                            nftAddress={nftAddress}
                            onClose={hideForecloseOnLoanModal}
                        />
                        <TooEarlyToForecloseOnLoanModal
                            isVisible={showTooEarlyToForecloseModal}
                            onClose={hideTooEarlyToForecloseModal}
                        />
                        <RepayLoanModal
                            isVisible={showRepayLoanModal}
                            tokenId={tokenId}
                            tokenName={tokenName}
                            tokenDescription={tokenDescription}
                            imageURI={imageURI}
                            loanAmount={loanAmount}
                            loanDuration={loanDuration}
                            interestRate={interestRate}
                            amountToRepay={amountToRepay}
                            borrower={borrower}
                            lender={lender}
                            marketplaceAddress={marketplaceAddress}
                            nftAddress={nftAddress}
                            onClose={hideRepayLoanModal}
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
