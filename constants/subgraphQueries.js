import { gql } from "@apollo/client"

const GET_ACTIVE_LISTINGS = gql`
    {
        activeListings(first: 5, where: { buyer: null }) {
            id
            buyer
            seller
            nftAddress
            tokenId
            price
        }
    }
`

const GET_PAWN_REQUESTS = gql`
    {
        activePawnRequests(first: 5, where: { lender: null }) {
            id
            borrower
            lender
            nftAddress
            tokenId
            loanAmount
            loanDuration
            interestRate
        }
    }
`

const GET_PAWN_AGREEMENT = gql`
    query GetPawnAgreements($userId: ID!) {
        activePawnAgreements(
            first: 5
            where: { or: [{ borrower: $userId }, { lender: $userId }] }
        ) {
            id
            borrower
            lender
            nftAddress
            tokenId
            loanAmount
            loanDuration
            interestRate
        }
    }
`
export { GET_ACTIVE_LISTINGS, GET_PAWN_REQUESTS, GET_PAWN_AGREEMENT }
