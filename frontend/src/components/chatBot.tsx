import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Moon, TrendingUp, Clock, Heart } from 'lucide-react';
import useNFTStore from '../stores/nftStore'; // Zustand store for NFT data
import { MentalHealthData } from './MentalHealthInsights';

interface NFT {
  metadata?: {
    description?: string;
  };
}
interface ChatbotProps {
    onAnalysisComplete: (result: MentalHealthData) => void;
  }
function Chatbot({ onAnalysisComplete }: ChatbotProps) {
  const [step, setStep] = useState(0);
  const [responses, setResponses] = useState<Record<number, string>>({});
  const [inputValue, setInputValue] = useState('');
  const { nfts } = useNFTStore(); // Get NFT data from Zustand store

  const questions = [
    "How would you describe your dream patterns this week?",
    "On a scale of 1 to 10, how would you rate your emotional state?",
    "How many hours of sleep did you average this week?",
    "What activities have positively impacted your mood recently?"
  ];

  const handleResponse = () => {
    if (inputValue.trim() === '') return; // Prevent empty responses
    setResponses((prev) => ({
      ...prev,
      [questions[step]]: inputValue
    }));
    setInputValue(''); // Clear the input field
    setStep((prev) => prev + 1); // Move to the next question
  };

  const handleSubmit = async () => {
    const payload = { responses };

    try {
      const response = await fetch('http://localhost:5001/analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result: MentalHealthData = await response.json();
      console.log('Analysis result:', result);
      onAnalysisComplete(result); // Pass result to parent
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto px-4 pt-32"
    >
      <motion.h1
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className="text-5xl font-bold mb-16 text-white uppercase glitch-effect"
      >
        Mental Health Chatbot
      </motion.h1>

      <AnimatePresence mode="wait">
        {step < questions.length ? (
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 0 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 0 }}
            transition={{ type: 'spring', stiffness: 100 }}
            className="bg-black border-2 border-white p-8 transition-all group"
          >
            <h2 className="text-xl font-bold mb-4">{questions[step]}</h2>
            <motion.input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleResponse()}
              className="w-full p-2 bg-black border-2 border-white text-white focus:outline-none"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-4 p-2 border-2 border-white text-white hover:bg-white hover:text-black transition-all"
              onClick={handleResponse}
            >
              Next
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key="thank-you"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black border-2 border-white p-8  transition-all group"
          >
            <h2 className="text-xl font-bold mb-4">Thank you for your responses!</h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 border-2 border-white text-white hover:bg-white hover:text-black transition-all"
              onClick={handleSubmit}
            >
              Submit and Analyze
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default Chatbot;

