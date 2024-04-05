import styles from "../styles/Home.module.css"
import Head from "next/head"
import Header from "../components/Header"
import { useMoralis } from "react-moralis"
import { Form, Button } from "web3uikit" // Import Form and Button components

const supportedChains = ["31337", "11155111"]

export default function Home() {
    const { isWeb3Enabled, chainId } = useMoralis()

    // Function to handle form submission
    async function handleListNft(formData) {
        const nftAddress = formData.data[0].inputResult
        const tokenId = formData.data[1].inputResult
        const price = formData.data[2].inputResult

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
            onSuccess: (tx) => handleApproveSuccess(tx, nftAddress, tokenId, price),
            onError: (error) => {
                console.log(error)
            },
        })
    }

    return (
        <div className={styles.container}>
            <div className="flex flex-col">
                {/* Form for listing NFT */}
                <Form
                    onSubmit={handleListNft}
                    data={[
                        {
                            name: "NFT Address",
                            type: "text",
                            value: "1",
                            key: "nftAddress",
                        },
                        {
                            name: "Token ID",
                            type: "number",
                            value: "1",
                            key: "tokenId",
                        },
                        {
                            name: "Price (in ETH)",
                            type: "number",
                            value: "1",
                            key: "price",
                        },
                    ]}
                    title="Sell your NFT!"
                    id="listNftForm"
                />
            </div>
        </div>
    )
}
