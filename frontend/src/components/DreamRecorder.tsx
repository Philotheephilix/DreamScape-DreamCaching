import { useState, useRef, useEffect } from 'react';
import { Loader, Wand2, Mic,X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {ethers} from 'ethers';
import Orb from './Orb';

function DreamRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [showModal, setShowModal] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const analyserRef = useRef<AnalyserNode>();
  const audioContextRef = useRef<AudioContext>();
  const previousDataRef = useRef<number[]>([]);
  const [coverImage, setCoverImage] = useState<string>('');
  const [metadataCID, setMetadataCID] = useState<string>('');
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);
  const closeModal = (): void => {
    setShowModal(false); // Close the modal
  };

  const setupAudioAnalyzer = (stream: MediaStream) => {
    if (!canvasRef.current) {
      console.error('Canvas element not found');
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Could not get canvas context');
      return;
    }

    audioContextRef.current = new AudioContext();
    analyserRef.current = audioContextRef.current.createAnalyser();
    const source = audioContextRef.current.createMediaStreamSource(stream);
    source.connect(analyserRef.current);
    
    // Adjust FFT size for fewer, wider bars
    analyserRef.current.fftSize = 64;
    // Smooth the transitions
    analyserRef.current.smoothingTimeConstant = 0.8;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    previousDataRef.current = new Array(bufferLength).fill(0);

    // Set canvas size with higher resolution
    canvas.width = 1000;
    canvas.height = 200;

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);
      analyserRef.current!.getByteFrequencyData(dataArray);

      // Clear the canvas with a slight fade effect
      ctx.fillStyle = 'rgb(0, 0, 0)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Calculate bar width and spacing
      const totalBars = bufferLength;
      const spacing = 15; // Space between bars
      const barWidth = (canvas.width / totalBars) - spacing;

      // Draw the spectrometer bars
      let x = 0;

      for (let i = 0; i < totalBars; i++) {
        // Smooth transition between current and previous values
        const value = dataArray[i];
        const targetHeight = (value / 255) * canvas.height;
        
        // Implement smooth decay
        const currentHeight = previousDataRef.current[i];
        const decay = 0.15; // Adjust this value to control decay speed
        
        let newHeight;
        if (targetHeight > currentHeight) {
          newHeight = targetHeight;
        } else {
          newHeight = Math.max(0, currentHeight - (currentHeight * decay));
        }
        previousDataRef.current[i] = newHeight;

        // Create gradient for each bar
        const gradient = ctx.createLinearGradient(
          x,
          canvas.height,
          x,
          canvas.height - newHeight
        );

        // Enhanced gradient colors
        gradient.addColorStop(0, 'rgb(255, 0, 255)'); // Start with transparent purple
        gradient.addColorStop(0.5, 'rgba(255, 0, 255, 0.6)'); // Mid purple
        gradient.addColorStop(1, 'rgba(0, 255, 255, 0.8)'); // End with cyan

        // Draw bar with rounded corners
        ctx.beginPath();
        ctx.roundRect(
          x,
          canvas.height - newHeight,
          barWidth,
          newHeight,
          3 // Border radius
        );
        ctx.fillStyle = gradient;
        ctx.fill();

        // Add glow effect
        ctx.shadowColor = 'rgba(255, 0, 255, 0.5)';
        ctx.shadowBlur = 15;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        // Move to next bar position with spacing
        x += barWidth + spacing;
      }
    };

    draw();
  };

  // Rest of the component code remains the same...
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsRecording(true);
      setTimeout(() => {
        setupAudioAnalyzer(stream);
      }, 0);

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
      setShowControls(false);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    setIsRecording(false);
    setIsProcessing(true);
    mediaRecorderRef.current!.onstop = async () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
      audioChunksRef.current = []; // Clear the stored chunks
  
      // Create a FormData object to send the audio file
      const formData = new FormData();
      formData.append("file", audioBlob, "recording.wav");
  
      try {
        const response = await fetch("http://localhost:5001/transcribe", {
          method: "POST",
          body: formData,
        });
        // const response ={
        //   "hash": {
        //     "fileId": "ipfs://bafkreibz32ptazwnzrtrxhwl3qsgycohmxactdy724hxshoytyttze7w64"
        //   },
        //   "status": "success"
        // }
        // const metadataHash = response;
        
        const metadataHash = await response.json();
        console.log("Transcription result:", metadataHash);
        setMetadataCID(metadataHash.hash.fileId.replace("ipfs://", ""));
        console.log(metadataCID)
        const metadataContent = await fetch(`https://${metadataCID}.ipfs.dweb.link`);
        const metadata = await metadataContent.json();
        console.log("Metadata:", metadata);
        setCoverImage(`https://${metadata.coverImage.replace("ipfs://", "")}.ipfs.dweb.link`);
        console.log("Cover image:", coverImage);
        // Stop processing after response is received
        setIsProcessing(false);
        setShowModal(true);
      } catch (error) {
        console.error("Error transcribing audio:", error);
        setIsProcessing(false);
      }
    };
  };


  const createNFT = async (): Promise<{ success: boolean; metadataURI: string; transactionHash: string }> => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const userAddress = accounts[0];
    const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();

        const ABI = [
            "function safeMint(address to, string memory uri) public",
            "function balanceOf(address owner) external view returns (uint256)",
            "function tokenOfOwnerByIndex(address owner, uint256 index) external view returns (uint256)",
            "function tokenURI(uint256 tokenId) external view returns (string)",
        ];

        const contract = new ethers.Contract(
            import.meta.env.VITE_PUBLIC_CONTRACT_ADDRESS,
            ABI,
            signer
        );

        // Calculate required ETH (0.01 ETH in this case)
        const mintPrice = ethers.parseEther("0.01");

        // Execute mint with payment
        const tx = await contract.safeMint(userAddress, metadataCID);

        const receipt = await tx.wait();
        setShowModal(false);
        return {
            success: true,
            metadataURI: `ipfs://${metadataCID}`,
            transactionHash: receipt.hash
        };
    } 


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto px-4 pt-32"
    >
      <div className="relative bg-black p-12">
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
                <div className="absolute inset-0  rounded-none opacity-20" />
                <Loader className="h-32 w-32 text-white animate-spin" />
                <motion.div
                  className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 whitespace-nowrap"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.01 }}
                >
                  <Wand2 className="inline-block mr-2 h-5 w-5 text-white" />
                  <span className="text-white uppercase">Processing Dream...</span>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="record"
                className="relative group"
                whileHover="hover"
                initial={false}
              >
                <motion.div
                  className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                  variants={{
                    hover: { opacity: 1 }
                  }}
                >
                  {!isRecording ? (
                    <span className="text-white text-sm bg-black/50 px-2 py-1 rounded">
                    Click to start recording
                  </span>
                  ):(<span className="text-white text-sm bg-black/50 px-2 py-1 rounded"></span>)}
                  
                </motion.div>

                <motion.button
                  onClick={isRecording ? stopRecording : startRecording}
                  whileHover={{ scale: 1.3 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <div className="relative p-12">
                    {isRecording ? (
                      <div className="relative w-500" style={{  }}>
                        <Orb 
                          hoverIntensity={1.11}
                          rotateOnHover={true}
                          hue={288}
                          forceHoverState={false}
                        />
                        <div className="absolute inset-0 animate-pulse">
                          <div className="absolute inset-0 rounded-full border-2 border-purple-500/50" />
                          <div className="absolute inset-0 rounded-full border-2 border-cyan-500/50" />
                        </div>
                      </div>
                    ) : (
                      <div style={{ scale: 3 }}>
                        <Orb
                          hoverIntensity={0}
                          rotateOnHover={true}
                          hue={288}
                          forceHoverState={false}
                        />
                      </div>
                    )}
                  </div>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Always render the canvas, but hide it when not recording */}
          <canvas
            ref={canvasRef}
            className={`w-full max-w-md ${isRecording ? 'block' : 'hidden'}`}
          />

          {isRecording && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center space-y-4"
            >
              <div className="flex items-center space-x-2 text-red-500">
                <Mic className="h-4 w-4 animate-pulse" />
                <span className="font-medium">Recording</span>
                <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse" />
              </div>
            </motion.div>
          )}

         
        </div>
      </div>
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-8 rounded-lg max-w-md w-full relative"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <button
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full"
                onClick={closeModal}
              >
                <X className="h-5 w-5 text-black" />
              </button>
                <div className="flex flex-col items-center space-y-6">
                <img
                  src={coverImage}
                  alt="Dream NFT"
                  className="w-full h-auto rounded-lg"
                />
                <motion.button
                  className="w-full py-4 bg-black text-white border-2 border-black hover:bg-white hover:text-black transition-all font-bold uppercase"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={createNFT}
                >
                  Mint Dream as NFT
                </motion.button>
                <motion.button
                  className="w-full py-4 bg-white text-black border-2 border-black hover:bg-black hover:text-white transition-all font-bold uppercase"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Share on Twitter
                </motion.button>
                </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default DreamRecorder;