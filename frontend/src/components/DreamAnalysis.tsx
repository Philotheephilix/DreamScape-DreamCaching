import { useState, useEffect } from 'react';
import MentalHealthInsights, { MentalHealthData } from './MentalHealthInsights';
import Chatbot from './chatBot';

export default function Analysis() {
    const [analysisResult, setAnalysisResult] = useState<MentalHealthData | null>(() => {
        // Retrieve stored data on initial render (only if not a page reload)
        return sessionStorage.getItem('analysisResult')
            ? JSON.parse(sessionStorage.getItem('analysisResult')!)
            : null;
    });

    useEffect(() => {
        if (analysisResult) {
            sessionStorage.setItem('analysisResult', JSON.stringify(analysisResult));
        }
    }, [analysisResult]);

    useEffect(() => {
        // Clear state on full page reload
        const handleReload = () => {
            sessionStorage.removeItem('analysisResult');
        };
        window.addEventListener('beforeunload', handleReload);
        return () => window.removeEventListener('beforeunload', handleReload);
    }, []);

    return (
      <div>
        {!analysisResult ? (
          <Chatbot onAnalysisComplete={(result) => setAnalysisResult(result)} />
        ) : (
          <MentalHealthInsights data={analysisResult} />
        )}
      </div>
    );
}
