import React, { useState } from 'react';
import { Mic, Square, Loader, Wand2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function DreamRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showControls, setShowControls] = useState(false);
  
  const startRecording = () => {
    setIsRecording(true);
    setShowControls(false);
  };
  
  const stopRecording = () => {
    setIsRecording(false);
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setShowControls(true);
    }, 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto px-4 pt-32"
    >
      <div className="relative bg-black border-2 border-white p-12">
        <motion.h1 
          className="text-5xl font-bold mb-16 text-center text-white uppercase glitch-effect"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Record Your Dream
        </motion.h1>
        
        <div className="flex flex-col items-center space-y-12">
          <AnimatePresence mode="wait">
            {isProcessing ? (
              <motion.div
                key="processing"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-white rounded-none opacity-20" />
                <Loader className="h-32 w-32 text-white animate-spin" />
                <motion.div 
                  className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 whitespace-nowrap"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <Wand2 className="inline-block mr-2 h-5 w-5 text-white" />
                  <span className="text-white uppercase">Processing Dream...</span>
                </motion.div>
              </motion.div>
            ) : (
              <motion.button
                key="record"
                onClick={isRecording ? stopRecording : startRecording}
                className={`relative group ${isRecording ? 'recording-pulse' : ''}`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <div className={`relative p-12 border-2 transition-colors ${
                  isRecording 
                    ? 'bg-red-600 border-white' 
                    : 'bg-black border-white hover:bg-white hover:text-black'
                }`}>
                  {isRecording ? (
                    <Square className="h-12 w-12" />
                  ) : (
                    <Mic className="h-12 w-12" />
                  )}
                </div>
              </motion.button>
            )}
          </AnimatePresence>
          
          <AnimatePresence>
            {showControls && (
              <motion.div 
                className="w-full space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <motion.button 
                  className="w-full py-6 bg-black text-white border-2 border-white hover:bg-white hover:text-black transition-all font-bold uppercase"
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Mint as NFT
                </motion.button>
                <motion.button 
                  className="w-full py-6 bg-white text-black border-2 border-white hover:bg-black hover:text-white transition-all font-bold uppercase"
                  whileHover={{ scale: 1.02, x: -5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Share on Twitter
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

export default DreamRecorder