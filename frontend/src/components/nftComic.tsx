import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, Share2, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import useNFTStore from '../stores/nftStore';

function NFTComic() {
  const { tokenId } = useParams();
  const { nfts } = useNFTStore();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nft = nfts.find(n => n.tokenId === tokenId);

  if (!nft) return <div className="text-white text-center pt-32">NFT not found</div>;

  const images = nft.metadata.ipfsarray?.map((ipfs: string) => 
    `https://${ipfs.replace('ipfs://', '')}.ipfs.dweb.link`
  ) || [];

  const handleNext = () => {
    setCurrentImageIndex(prev => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentImageIndex(prev => (prev - 1 + images.length) % images.length);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-5xl mx-auto px-4 pt-32"
    >
      <Link 
        to="/diary"
        className="mb-8 inline-block text-white hover:text-gray-300 transition-all"
      >
        &larr; Back to Diary
      </Link>

      <motion.div
        className="bg-black/30 backdrop-blur-lg rounded-3xl border-2 border-white/20 shadow-2xl overflow-hidden"
        initial={{ y: 20 }}
        animate={{ y: 0 }}
      >
        <div className="flex flex-col md:flex-row">
          {/* Enhanced Carousel Section */}
          <div className="md:w-2/3 relative overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 animate-pulse"
              animate={{
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            
            <AnimatePresence mode='wait'>
              <motion.div
                key={currentImageIndex}
                className="relative h-[600px]"
                initial={{ opacity: 0, scale: 0.95, rotate: -1 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  rotate: 0,
                  y: [0, -10, 0],
                }}
                exit={{ opacity: 0, scale: 1.05, rotate: 1 }}
                transition={{ 
                  duration: 1.5,
                  ease: "easeInOut",
                  y: {
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }
                }}
              >
                <img
                  src={images[currentImageIndex]}
                  className="w-full h-full object-contain p-8 filter saturate-150 contrast-125 hover:saturate-200 transition-all"
                />
                
                {/* Floating Particles */}
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute bg-white/10 rounded-full"
                    style={{
                      width: Math.random() * 5 + 2 + 'px',
                      height: Math.random() * 5 + 2 + 'px',
                      top: Math.random() * 100 + '%',
                      left: Math.random() * 100 + '%',
                    }}
                    animate={{
                      y: [0, -40, 0],
                      opacity: [0.3, 1, 0.3],
                    }}
                    transition={{
                      duration: Math.random() * 3 + 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Ethereal Navigation Arrows */}
            {images.length > 1 && (
              <>
                <motion.button
                  onClick={handlePrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 backdrop-blur-lg rounded-full bg-black/30 hover:bg-white/20 transition-all"
                  whileHover={{ scale: 1.1 }}
                >
                  <ChevronLeft className="h-8 w-8 text-white/80 hover:text-white" />
                </motion.button>
                <motion.button
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 backdrop-blur-lg rounded-full bg-black/30 hover:bg-white/20 transition-all"
                  whileHover={{ scale: 1.1 }}
                >
                  <ChevronRight className="h-8 w-8 text-white/80 hover:text-white" />
                </motion.button>
              </>
            )}
          </div>

          {/* Dreamy Details Section */}
          <div className="p-8 md:w-1/3 bg-gradient-to-b from-black/60 to-purple-900/20 backdrop-blur-lg">
            <div className="flex items-center space-x-6 text-white/80 mb-6 uppercase font-mono">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-purple-400" />
                <span>
                  {nft.metadata.date ? 
                    format(new Date(nft.metadata.date), 'dd MMM yyyy') : 
                    'Date not available'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-cyan-400" />
                <span>{nft.metadata.duration || 'Duration not available'}</span>
              </div>
            </div>

            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-300 mb-6 uppercase tracking-wider"
            >
              {nft.metadata.title || 'Untitled Dream'}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-white/90 mb-8 text-lg font-mono leading-relaxed border-l-4 border-purple-500/50 pl-4"
            >
              {nft.metadata.description || 'Description not available'}
            </motion.p>

            {/* Enchanted Image Indicators */}
            {images.length > 1 && (
              <div className="flex flex-wrap gap-3 mb-8">
                {images.map((_: string, index: number) => (
                  <motion.button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`h-1.5 rounded-full transition-all ${
                      index === currentImageIndex 
                        ? 'w-8 bg-gradient-to-r from-purple-400 to-pink-300' 
                        : 'w-4 bg-white/30 hover:bg-white/50'
                    }`}
                    whileHover={{ scale: 1.2 }}
                  />
                ))}
              </div>
            )}

            <div className="flex space-x-4">
              <motion.a
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-400 text-white font-bold uppercase rounded-lg hover:shadow-purple-glow transition-all flex items-center space-x-2"
              >
                <ExternalLink className="h-4 w-4" />
                <span>View on Marketplace</span>
              </motion.a>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default NFTComic;