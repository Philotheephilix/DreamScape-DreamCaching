import React from 'react';
import { Web3Provider } from '@ethersproject/providers';
import useWalletStore from '../stores/walletStore';
import useNFTStore from '../stores/nftStore';

const ConnectWallet: React.FC = () => {
  const { walletAddress, setWalletAddress } = useWalletStore();
  const { fetchNFTs } = useNFTStore();

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        // Request account access
        const provider = new Web3Provider(window.ethereum);
        await provider.send('eth_requestAccounts', []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();

        // Set wallet address in Zustand store
        setWalletAddress(address);

        // Fetch NFTs for the connected wallet
        await fetchNFTs(address);
      } catch (error) {
        console.error('Error connecting wallet:', error instanceof Error ? error.message : 'Unknown error');
      }
    } else {
      alert('Please install MetaMask to connect your wallet.');
    }
  };

  return (
    <div>
      {walletAddress ? (
        <div           className="px-6 py-3 bg-blue-600 text-white font-bold uppercase rounded-lg hover:bg-blue-700 transition-all"
>
          <p>Connected</p>
        </div>
      ) : (
        <button
          onClick={connectWallet}
          className="px-6 py-3 bg-blue-600 text-white font-bold uppercase rounded-lg hover:bg-blue-700 transition-all"
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
};

export default ConnectWallet;