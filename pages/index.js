import { useMoralis } from "react-moralis"
import NftBox from "../components/NftBox"
import {
    GET_ACTIVE_LISTINGS,
    GET_PAWN_REQUESTS,
    GET_lISTINGS_AND_REQUESTS,
} from "../constants/subgraphQueries"
import { useQuery } from "@apollo/client"
import networkMapping from "../constants/networkMapping.json"
import PawnBox from "../components/PawnBox"

export default function Home() {
    const { chainId, isWeb3Enabled } = useMoralis()
    const chainString = chainId ? parseInt(chainId).toString() : null
    const marketplaceAddress = chainId ? networkMapping[chainString].NftMarketplace[0] : null

    const {
        loading: listingsLoading,
        error: listingsError,
        data: listingsAndRequests,
    } = useQuery(GET_lISTINGS_AND_REQUESTS)
    // const {
    //     loading: pawnRequestsLoading,
    //     error: pawnRequestsError,
    //     data: pawnRequests,
    // } = useQuery(GET_PAWN_REQUESTS)

    return (
        <div className="container mx-auto">
            <div className="py-4 px-4" style={{ border: "1px solid black" }}>
                <h1 className="py-4 px-4 font-bold text-2xl">Recently Listed For Sale</h1>
                <div className="flex flex-wrap">
                    {isWeb3Enabled && chainId ? (
                        listingsLoading ? (
                            <div>Loading...</div>
                        ) : (
                            listingsAndRequests.activeListings.map((nft) => {
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
                <div className="flex flex-wrap">
                    {isWeb3Enabled && chainId ? (
                        listingsLoading ? (
                            <div>Loading...</div>
                        ) : (
                            listingsAndRequests.activePawnRequests.map((nft) => {
                                const {
                                    nftAddress,
                                    tokenId,
                                    borrower,
                                    loanAmount,
                                    loanDuration,
                                    interestRate,
                                } = nft
                                return marketplaceAddress ? (
                                    <PawnBox
                                        loanAmount={loanAmount}
                                        nftAddress={nftAddress}
                                        tokenId={tokenId}
                                        marketplaceAddress={marketplaceAddress}
                                        borrower={borrower}
                                        interestRate={interestRate}
                                        loanDuration={loanDuration}
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
        </div>
    )
}
