import { ConnectButton } from "web3uikit"
import Link from "next/link"
import { useEffect } from "react"

export default function Header() {
    return (
        <nav className="flex items-center justify-between p-4 bg-gray-200">
            <h1 className="text-2xl font-bold font-sans text-blue-800 border-r-2 pr-4">
                Nft Marketplace
            </h1>
            <div class="border-l border-2 border-gray-300 h-16  "></div>
            <div className="flex items-center p-2  space-x-4 ml-4">
                <Link href="/">
                    <a className="font-sans mr-4 p-4 text-blue-800">Home</a>
                </Link>
                <Link href="/list-nft">
                    <a className="font-sans mr-4 p-4 text-blue-800">List Nft</a>
                </Link>
                <Link href="/pawn-nft">
                    <a className="font-sans mr-4 p-4 text-blue-800">Pawn Nft</a>
                </Link>
                <Link href="/withdraw">
                    <a className="font-sans mr-4 p-4 text-blue-800">Withdraw</a>
                </Link>
                <Link href="/your-pawn-agreements">
                    <a className="font-sans mr-4 p-4 text-blue-800">Your Active Loans</a>
                </Link>
                <Link href="/mint-nft">
                    <a className="font-sans mr-4 p-4 text-blue-800">Mint Nft</a>
                </Link>
            </div>
            <div className="ml-auto">
                <ConnectButton moralisAuth={false} />
            </div>
        </nav>
    )
}
