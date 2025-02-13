// types.ts
export interface NFT {
    tokenId: string;
    metadata: any; // Replace `any` with a more specific type if you know the structure of your metadata
}

export interface NFTStore {
    nfts: NFT[];
    loading: boolean;
    error: string | null;
    fetchNFTs: (userAddress: string) => Promise<void>;
}