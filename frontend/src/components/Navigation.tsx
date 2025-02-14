import  { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Moon, BookOpen, Brain, Music } from 'lucide-react';
import { motion } from 'framer-motion';
import ConnectWallet from './connectWallet';

function Navigation() {
  const location = useLocation();
  const [isSpotifyLoading, setIsSpotifyLoading] = useState(false);
  
  const handleSpotifyClick = async () => {
    setIsSpotifyLoading(true);
    const analysisResult = JSON.parse(sessionStorage.getItem('analysisResult') || '{}');
    console.log( analysisResult.data?.MOOD);
    const response = await fetch('http://localhost:5001/create-playlist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mood: analysisResult.data?.MOOD
      })
    });
    const data = await response.json();
    const playlistLink = data.playlistLink;
    window.open(playlistLink, '_blank');
    setIsSpotifyLoading(false);
  };
  
  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 bg-black border-b-2 border-white"
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center space-x-3 group">
            <motion.div
              whileHover={{ scale: 1.2, rotate: 90 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Moon className="h-8 w-8 text-white" />
            </motion.div>
            <span className="text-xl font-bold text-white glitch-effect">
              DREAMSCAPE
            </span>
          </Link>
          
          <div className="flex items-center space-x-6">
            {[
              { to: '/', icon: Moon, label: 'RECORD' },
              { to: '/diary', icon: BookOpen, label: 'DIARY' },
              { to: '/insights', icon: Brain, label: 'INSIGHTS' }
            ].map(({ to, icon: Icon, label }) => (
              <Link
                key={to}
                to={to}
                className={`relative px-4 py-2 font-bold transition-all ${
                  location.pathname === to 
                    ? 'text-black bg-white' 
                    : 'text-white hover:bg-white hover:text-black'
                }`}
              >
                <motion.div
                  className="flex items-center space-x-2"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </motion.div>
              </Link>
            ))}
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSpotifyClick}
              disabled={isSpotifyLoading}
              className="px-4 py-2 font-bold text-white border-2 border-white hover:bg-white hover:text-black transition-all disabled:opacity-50"
            >
              <div className="flex items-center space-x-2">
                {isSpotifyLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Music className="h-4 w-4" />
                  </motion.div>
                ) : (
                  <Music className="h-4 w-4" />
                )}
                <span>PLAYLIST</span>
              </div>
            </motion.button>
            <ConnectWallet/>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}

export default Navigation