'use client';
import React, { useState, useEffect } from 'react';
import { PinataSDK } from 'pinata-web3';
import { ethers } from 'ethers';

const pinata = new PinataSDK({
    pinataJwt: process.env.NEXT_PUBLIC_PINATA_JWT,
    pinataGateway: process.env.NEXT_PUBLIC_GATEWAY_URL
});

async function mintNFT(pdfFile, userAddress) {
    try {
        console.log('Uploading PDF to IPFS...');
        const pdfCID = await uploadFileToIPFS(pdfFile);

        // Create metadata with thumbnail (use a generic PDF icon)
        const metadata = {
            name: 'PDF Document',
            description: 'Stored on IPFS',
            image: `ipfs://${pdfCID}`,
            attributes: [
                { trait_type: "File Type", value: "PDF" },
                { trait_type: "IPFS CID", value: pdfCID }
            ]
        };

        const metadataCID = (await uploadJSONToIPFS(metadata)).IpfsHash;

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
            process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
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
        throw new Error(`Minting failed: ${error.message}`);
    }
}

async function uploadFileToIPFS(file) {
    const upload = await pinata.upload.file(file);
    return upload.IpfsHash;
}

async function uploadJSONToIPFS(jsonData) {
    const upload = await pinata.upload.json(jsonData);
    return upload;
}

async function fetchNFTs(userAddress) {
    try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();

        const ABI = [
            "function balanceOf(address owner) external view returns (uint256)",
            "function tokenOfOwnerByIndex(address owner, uint256 index) external view returns (uint256)",
            "function tokenURI(uint256 tokenId) external view returns (string)",
        ];

        const contract = new ethers.Contract(
            process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
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

       // return nfts;
    } catch (error) {
        console.error('Error fetching NFTs:', error);
        throw new Error(`Failed to fetch NFTs: ${error.message}`);
    }
}

export default function NFTMinter() {
    const [status, setStatus] = useState('');
    const [file, setFile] = useState(null);
    const [nfts, setNFTs] = useState([]);
    const [userAddress, setUserAddress] = useState('');

    useEffect(() => {
        // Fetch user's NFTs when the component mounts
        if (userAddress) {
            fetchNFTs(userAddress)
                .then((nfts) => setNFTs(nfts))
                .catch((error) => setStatus(`Error fetching NFTs: ${error.message}`));
        }
    }, [userAddress]);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleMint = async () => {
        if (!file) {
            setStatus('Please select a PDF file');
            return;
        }

        try {
            setStatus('Starting NFT creation process...');
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const userAddress = accounts[0];
            setUserAddress(userAddress);
            const updatedNFTs = await fetchNFTs(userAddress);

            const result = await mintNFT(file, userAddress);
            setStatus(`NFT created successfully! Transaction: ${result.transactionHash}`);

            // Refresh the list of NFTs after minting
            setNFTs(updatedNFTs);
        } catch (error) {
            setStatus(`Error: ${error.message}`);
        }
    };

    return (
        <div className="p-4">
            <div className="mb-4">
                <input type="file" accept="application/pdf" onChange={handleFileChange} className="mb-2" />
            </div>

            <button onClick={handleMint} className="bg-blue-500 text-white px-4 py-2 rounded" disabled={!file}>
                Create NFT
            </button>

            {status && <div className="mt-4 p-4 border rounded">{status}</div>}

            <div className="mt-8">
                <h2 className="text-xl font-bold mb-4">Your NFTs</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {Array.isArray(nfts) && nfts.map((nft) => (
                        <div key={nft.tokenId} className="border p-4 rounded-lg">
                            <img
                                alt={nft.name}
                                className="w-full h-48 object-cover mb-2"
                            />
                            <h3 className="text-lg font-semibold">{nft.name}</h3>
                            <p className="text-sm text-gray-600">{nft.description}</p>
                            <p className="text-sm text-gray-500">Token ID: {nft.tokenId}</p>
                        </div>
                    ))}
                </div>
        
                </div>
            </div>
        </div>
    );
}