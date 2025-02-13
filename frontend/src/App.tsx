import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import DreamRecorder from './components/DreamRecorder';
import DreamDiary from './components/DreamDiary';
import NFTComic from './components/nftComic';
import Analysis from './components/DreamAnalysis';


function App() {
  
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-black text-white">
        <Navigation />
        <main>
          <Routes>
            <Route path="/" element={<DreamRecorder />} />
            <Route path="/diary" element={<DreamDiary />} />
            <Route path="/insights" element={<Analysis />} />
            <Route path="/nft/:tokenId" element={<NFTComic />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;