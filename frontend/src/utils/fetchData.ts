

import { PinataSDK } from 'pinata-web3';
import { ethers } from 'ethers';

const pinata = new PinataSDK({
    pinataJwt: process.env.NEXT_PUBLIC_PINATA_JWT,
    pinataGateway: process.env.NEXT_PUBLIC_GATEWAY_URL
});
export async function fetchNFTs(userAddress : any)  {
    try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();

        const ABI = [
            "function balanceOf(address owner) external view returns (uint256)",
            "function tokenOfOwnerByIndex(address owner, uint256 index) external view returns (uint256)",
            "function tokenURI(uint256 tokenId) external view returns (string)",
        ];

        const contract = new ethers.Contract(
            process.env.VITE_PUBLIC_CONTRACT_ADDRESS || '',
            ABI,
            signer
        );

        // Get the number of NFTs owned by the user
        const balance = await contract.balanceOf(userAddress);

        // Fetch metadata for each NFT
        const nfts = [];
        for (let i = 0; i < balance; i++) {
            const tokenId = await contract.tokenOfOwnerByIndex(userAddress, i);
            const tokenURI = await contract.tokenURI(tokenId);
            console.log(i  + tokenURI);
            const replacedTokenURI = tokenURI.replace('ipfs://','');
            // Fetch metadata from IPFS
            const response = await pinata.gateways.get(replacedTokenURI);           
            const metadata = response.data;
            console.log(metadata);
           nfts.push({
              tokenId: tokenId.toString(),
              metadata
           });
        }

       return nfts;
    } catch (error) {
        console.error('Error fetching NFTs:', error);
        throw new Error(`Failed to fetch NFTs: `);
    }
}

