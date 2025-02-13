import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import DreamRecorder from './components/DreamRecorder';
import DreamDiary from './components/DreamDiary';
import MentalHealthInsights from './components/MentalHealthInsights';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-black text-white">
        <Navigation />
        <main>
          <Routes>
            <Route path="/" element={<DreamRecorder />} />
            <Route path="/diary" element={<DreamDiary />} />
            <Route path="/insights" element={<MentalHealthInsights />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;