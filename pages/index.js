import { useMoralis } from "react-moralis"
import NftBox from "../components/NftBox"
import GET_ACTIVE_LISTINGS from "../constants/subgraphQueries"
import { useQuery } from "@apollo/client"
import { networkMapping } from "../constants/networkMapping.json"

export default function Home() {
    const { chainId, isWeb3Enabled } = useMoralis()
    const marketplaceAddress = process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT_ADDRESS

    const { loading, error, data: listedNfts } = useQuery(GET_ACTIVE_LISTINGS)

    return (
        <div className="container mx-auto">
            <div className="py-4 px-4" style={{ border: "1px solid black" }}>
                <h1 className="py-4 px-4 font-bold text-2xl">Recently Listed For Sale</h1>
                <div className="flex flex-wrap">
                    {isWeb3Enabled && chainId ? (
                        loading || !listedNfts ? (
                            <div>Loading...</div>
                        ) : (
                            listedNfts.activeListings.map((nft) => {
                                const { price, nftAddress, tokenId, seller } = nft
                                return marketplaceAddress ? (
                                    <NftBox
                                        price={price}
                                        nftAddress={nftAddress}
                                        tokenId={tokenId}
                                        marketplaceAddress={marketplaceAddress}
                                        seller={seller}
                                        key={`${nftAddress}${tokenId}`}
                                    />
                                ) : (
                                    <div>
                                        Network error, please switch to a supported network.{" "}
                                    </div>
                                )
                            })
                        )
                    ) : (
                        <div>Web3 Currently Not Enabled</div>
                    )}
                </div>
            </div>
            <br></br>
            <div className="py-4 px-4" style={{ border: "1px solid black" }}>
                <h1 className="py-4 px-4 font-bold text-2xl">Recently Listed Pawn Requests</h1>
                <div className="flex flex-wrap"></div>
            </div>
        </div>
    )
}
