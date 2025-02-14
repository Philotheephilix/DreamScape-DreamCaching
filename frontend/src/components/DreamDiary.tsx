import { useState } from 'react';
import { Calendar, Clock, Share2, ExternalLink, Wand2, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import useNFTStore from '../stores/nftStore';
import { Link } from 'react-router-dom';
import PostTweet from './X'; // Import the TwitterModal component

function DreamDiary() {
  const { nfts, loading, error } = useNFTStore();
  const [showTwitterModal, setShowTwitterModal] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState<{ metadata: any } | undefined>(undefined);

  interface NFT {
    tokenId: string;
    metadata: {
      coverImage?: string;
      image?: string;
      date?: string;
      timeStamp: string;
      fullDescription?: string;
    };
  }

  const handleShareClick = (nft: NFT) => {
    setSelectedNFT(nft as any);
    setShowTwitterModal(true);
  };

  if (loading)
    return (
      <motion.div
        key="processing"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0 }}
        className="relative h-screen flex flex-col items-center justify-center"
      >
        <div className="absolute inset-0 bg-black opacity-20" />
        <Loader2 className="h-32 w-32 text-white animate-spin mb-8" />
        <motion.div
          className="flex items-center space-x-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Wand2 className="h-5 w-5 text-white" />
          <span className="text-white uppercase">Fetching Dream Diary...</span>
        </motion.div>
      </motion.div>
    );

  if (error) return <div>Error: {error}</div>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-5xl mx-auto px-4 pt-32"
    >
      <motion.h1
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className="text-5xl font-bold mb-16 text-white uppercase glitch-effect"
      >
        Dream Diary
      </motion.h1>

      <motion.div
        className="grid gap-12"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: {
              staggerChildren: 0.2,
            },
          },
        }}
        initial="hidden"
        animate="show"
      >
        {nfts.map((nft) => (
          <motion.div
            key={nft.tokenId}
            variants={{
              hidden: { opacity: 0, x: -50 },
              show: { opacity: 1, x: 0 },
            }}
            whileHover={{ x: 20 }}
            className="bg-black border-2 border-white"
          >
            <div className="flex flex-col md:flex-row">
              <motion.div
                className="md:w-2/5 relative overflow-hidden border-b-2 md:border-b-0 md:border-r-2 border-white"
                whileHover={{ scale: 1.02 }}
              >
                <img
                  src={
                    nft?.metadata?.coverImage
                      ? `https://${nft.metadata.coverImage.replace('ipfs://', '')}.ipfs.dweb.link`
                      : nft?.metadata?.image
                      ? `https://${nft.metadata.image.replace('ipfs://', '')}.ipfs.dweb.link`
                      : '/fallback-image.jpg'
                  }
                  className="w-full h-64 md:h-full object-cover filter grayscale hover:grayscale-0 transition-all"
                />
              </motion.div>

              <div className="p-8 md:w-3/5">
                <div className="flex items-center space-x-6 text-white mb-6 uppercase font-mono">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {nft.metadata.date
                        ? format(new Date(nft.metadata.timeStamp), 'dd/MM/yyyy')
                        : 'Date not available'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>{nft.metadata.timeStamp || 'Duration not available'}</span>
                  </div>
                </div>

                <p className="text-white mb-8 text-lg font-mono leading-relaxed">
                  {nft.metadata.fullDescription || 'Description not available'}
                </p>

                <div className="flex space-x-4">
                  <Link to={`/nft/${nft.tokenId}`}>
                    <motion.button
                      whileHover={{ scale: 1.05, x: 5 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-3 bg-white text-black font-bold uppercase border-2 border-white hover:bg-black hover:text-white transition-all flex items-center space-x-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span>View NFT</span>
                    </motion.button>
                  </Link>
                  <motion.button
                    onClick={() => handleShareClick(nft)}
                    whileHover={{ scale: 1.05, x: -5 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-black text-white font-bold uppercase border-2 border-white hover:bg-white hover:text-black transition-all flex items-center space-x-2"
                  >
                    <Share2 className="h-4 w-4" />
                    <span>Share</span>
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Render the TwitterModal */}
      <PostTweet
        isOpen={showTwitterModal}
        onClose={() => setShowTwitterModal(false)}
        nft={selectedNFT}
      />
    </motion.div>
  );
}

export default DreamDiary;