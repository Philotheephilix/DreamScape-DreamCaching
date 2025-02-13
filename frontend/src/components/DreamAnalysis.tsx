import React, { useState } from 'react';
import  MentalHealthInsights from './MentalHealthInsights';
import { MentalHealthData } from './MentalHealthInsights';
import Chatbot from './chatBot';

interface ChatbotProps {
  onAnalysisComplete: (result: MentalHealthData) => void;
}

function Analysis() {
  const [analysisResult, setAnalysisResult] = useState<MentalHealthData | null>(null);

  const handleAnalysisResult = (result: MentalHealthData) => {
    setAnalysisResult(result);
  };

  return (
    <div>
      {!analysisResult ? (
        <Chatbot />
      ) : (
        <MentalHealthInsights data={analysisResult} />
      )}
    </div>
  );
}

export default Analysis;