import { ethers } from 'ethers';

declare global {
    interface Window {
        ethereum: any;
    }
}

async function mintNFT(pdfFile : any, userAddress : any) {
    try {
        console.log('Uploading PDF to IPFS...');

        // Create metadata with thumbnail (use a generic PDF icon)
        

        const metadataCID = await postMessage('/create-metadata')

        // Connect to contract
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();

        const ABI = [
            "function safeMint(address to, string memory uri) public",
            "function balanceOf(address owner) external view returns (uint256)",
            "function tokenOfOwnerByIndex(address owner, uint256 index) external view returns (uint256)",
            "function tokenURI(uint256 tokenId) external view returns (string)",
        ];

        const contract = new ethers.Contract(
            process.env.VITE_PUBLIC_CONTRACT_ADDRESS || '',
            ABI,
            signer
        );

        // Calculate required ETH (0.01 ETH in this case)
        const mintPrice = ethers.parseEther("0.01");

        // Execute mint with payment
        const tx = await contract.safeMint(userAddress, `ipfs://${metadataCID}`);

        const receipt = await tx.wait();
        return {
            success: true,
            metadataURI: `ipfs://${metadataCID}`,
            transactionHash: receipt.hash
        };
    } catch (error) {
        console.error('Minting error:', error);
        throw new Error(`Minting failed:`);
    }
}