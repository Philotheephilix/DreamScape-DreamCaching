// stores/nftStore.ts
import { create } from 'zustand';
import { PinataSDK } from 'pinata-web3';
import { ethers } from 'ethers';
import { NFT, NFTStore } from '../types/types'; // Adjust the import path

const pinata = new PinataSDK({
    pinataJwt: import.meta.env.VITE_PUBLIC_PINATA_JWT,
    pinataGateway: import.meta.env.VITE_PUBLIC_GATEWAY_URL,
});

// Zustand store for NFTs
const useNFTStore = create<NFTStore>((set) => ({
    nfts: [], // Array to store fetched NFTs
    loading: false, // Loading state
    error: null, // Error state

    // Function to fetch NFTs
    fetchNFTs: async (userAddress: string) => {
        set({ loading: true, error: null }); // Set loading state

        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();

            const ABI = [
                "function balanceOf(address owner) external view returns (uint256)",
                "function tokenOfOwnerByIndex(address owner, uint256 index) external view returns (uint256)",
                "function tokenURI(uint256 tokenId) external view returns (string)",
            ];

            const contract = new ethers.Contract(
                import.meta.env.VITE_PUBLIC_CONTRACT_ADDRESS || '',
                ABI,
                signer
            );

            // Get the number of NFTs owned by the user
            const balance = await contract.balanceOf(userAddress);

            // Fetch metadata for each NFT
            const nfts: NFT[] = [];
            for (let i = 0; i < balance; i++) {
                const tokenId = await contract.tokenOfOwnerByIndex(userAddress, i);
                const tokenURI = await contract.tokenURI(tokenId);
                const replacedTokenURI = tokenURI.replace('ipfs://', '');
                // Fetch metadata from IPFS
                const response = await pinata.gateways.get(replacedTokenURI);
                const metadata = response.data;
                nfts.push({
                    tokenId: tokenId.toString(),
                    metadata,
                });
            }

            // Update the store with fetched NFTs
            set({ nfts, loading: false });
        } catch (error: any) {
            console.error('Error fetching NFTs:', error);
            set({ error: error.message, loading: false }); // Set error state
        }
    },
}));

export default useNFTStore;