import React from 'react';
import { Calendar, Clock, Share2, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

const mockDreams = [
  {
    id: 1,
    date: new Date(2024, 2, 15),
    duration: '2:34',
    imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800',
    description: 'I was flying through clouds made of cotton candy, surrounded by iridescent butterflies that whispered ancient secrets...'
  },
  {
    id: 2,
    date: new Date(2024, 2, 14),
    duration: '3:12',
    imageUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800',
    description: 'Exploring a crystal cave beneath the ocean, where bioluminescent creatures danced in intricate patterns...'
  }
];

function DreamDiary() {
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
              staggerChildren: 0.2
            }
          }
        }}
        initial="hidden"
        animate="show"
      >
        {mockDreams.map((dream, index) => (
          <motion.div
            key={dream.id}
            variants={{
              hidden: { opacity: 0, x: -50 },
              show: { opacity: 1, x: 0 }
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
                  src={dream.imageUrl} 
                  alt="Dream visualization" 
                  className="w-full h-64 md:h-full object-cover filter grayscale hover:grayscale-0 transition-all"
                />
              </motion.div>
              
              <div className="p-8 md:w-3/5">
                <div className="flex items-center space-x-6 text-white mb-6 uppercase font-mono">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>{format(dream.date, 'dd/MM/yyyy')}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>{dream.duration}</span>
                  </div>
                </div>
                
                <p className="text-white mb-8 text-lg font-mono leading-relaxed">
                  {dream.description}
                </p>
                
                <div className="flex space-x-4">
                  <motion.button 
                    whileHover={{ scale: 1.05, x: 5 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-white text-black font-bold uppercase border-2 border-white hover:bg-black hover:text-white transition-all flex items-center space-x-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>View NFT</span>
                  </motion.button>
                  <motion.button 
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
    </motion.div>
  );
}

export default DreamDiary