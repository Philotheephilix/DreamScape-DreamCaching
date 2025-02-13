import  { useState, useRef } from 'react';
import {  Loader, Wand2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Orb from './Orb';


function DreamRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setAudioBlob(audioBlob);
        audioChunksRef.current = [];
      };
      mediaRecorderRef.current.start();
      setIsRecording(true);
      setShowControls(false);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setShowControls(true);
    }, 2000);
  };

  //const downloadAudio = () => {
   /* if (audioBlob) {
      const url = URL.createObjectURL(audioBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'dream-recording.wav';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };*/

  const createNFT = (): void => {
    console.log('Creating NFT...');
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto px-4 pt-32"
    >
      <div className="relative bg-black   p-12">
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
                className={`relative group`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <div className={`relative p-12 border-2  ${
                  isRecording 
                    ? ' border-none' 
                    : ' border-none '
                }`}>
                  {isRecording ? (
                    <div style={{ width: '100%', height:'100%',  position: 'relative' ,scale:"2"}}>
                    <Orb
                      hoverIntensity={1.11}
                      rotateOnHover={false}
                      hue={288}
                      forceHoverState={false}
                    />
                  </div>
                  ) : (
                    <div style={{ width: '100%', height:'100%',  position: 'relative', scale:"2"}}>
                    <Orb
                      hoverIntensity={0}
                      rotateOnHover={false}
                      hue={288}
                      forceHoverState={false}
                    />
                  </div>
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
                  onClick={createNFT}
                >
                 
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

export default DreamRecorder;