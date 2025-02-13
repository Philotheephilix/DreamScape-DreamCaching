// components/NFTList.tsx
import React from 'react';
import useNFTStore from '../stores/nftStore';

const NFTList: React.FC = () => {
    const { nfts, loading, error } = useNFTStore();

    if (loading) return <p>Loading NFTs...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h1>My NFTs</h1>
            {nfts.map((nft) => (
                <div key={nft.tokenId}>
                    <h2>Token ID: {nft.tokenId}</h2>
                    <pre>{JSON.stringify(nft.metadata, null, 2)}</pre>
                </div>
            ))}
        </div>
    );
};

export default NFTList;