import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react"; 

interface TwitterAuthResponse {
  accessToken: string;
  accessTokenSecret: string;
}

interface PostTweetProps {
  isOpen: boolean;
  onClose: () => void;
  nft?: {
    metadata: any
  };
}

const PostTweet = ({isOpen, onClose ,nft}: PostTweetProps) => {
  console.log(nft?.metadata?.fullDescription);
  const [tweetText, setTweetText] = useState<string>(nft?.metadata?.coverData[0].short_description || '');
    const [accessToken, setAccessToken] = useState<string>('');
  const [accessTokenSecret, setAccessTokenSecret] = useState<string>('');
  const [pinCode, setPinCode] = useState<string>('');
  const [images, setImages] = useState<string>(`https://${nft?.metadata?.coverImage?.replace('ipfs://', '')}.ipfs.dweb.link` || 'no image');
  const [mediaIds, setMediaIds] = useState<string[]>([]);


const handleAuth = async () => {
    // Redirect to backend to start OAuth flow
    window.open('http://localhost:5000/auth/twitter', '_blank');
};

  const handlePinSubmit = async () => {
    try {
      const response = await axios.get<TwitterAuthResponse>(
        `http://localhost:5000/callback?oauth_verifier=${pinCode}`
      );
      setAccessToken(response.data.accessToken);
      setAccessTokenSecret(response.data.accessTokenSecret);
      setTweetText(nft?.metadata?.coverData[0].short_description)
      setImages(`https://${nft?.metadata?.coverImage?.replace('ipfs://', '')}.ipfs.dweb.link` || 'no image')
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error during callback:', error.response?.data || error.message);
      } else {
        console.error('Unexpected error:', error);
      }
    }
  };

  

  const uploadImages = async () => {
    try {
      // Fetch image from URL
      const response = await fetch(images);
      if (!response.ok) throw new Error('Failed to fetch image');
      const blob = await response.blob();
  
      // Convert blob to base64
      const base64Image = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error('Failed to read image'));
        reader.readAsDataURL(blob);
      });
  
      // Upload to Twitter
      const { data } = await axios.post('http://localhost:5000/upload-media', {
        accessToken,
        accessTokenSecret,
        images: [base64Image]
      });
  
      setMediaIds(data.mediaIds);
      alert('Image uploaded successfully!');
    } catch (error) {
      console.error('Image upload error:', error);
      alert('Error uploading image');
    }
  };

  const handlePostTweet = async () => {
    try {
      console.log('Posting tweet:', tweetText);
      console.log('Media IDs:', mediaIds,tweetText,accessToken,accessTokenSecret); 
      const response = await axios.post('http://localhost:5000/tweet', {
        accessToken,
        accessTokenSecret,
        text: tweetText,
        mediaIds,
      });
      alert('Tweet posted successfully!');
      console.log('Tweet response:', response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error posting tweet:', error.response?.data || error.message);
      } else {
        console.error('Unexpected error:', error);
      }
      alert('Error posting tweet');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white p-8 rounded-lg h-maxfit w-full relative"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
          >
            <button
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full"
              onClick={onClose}
            >
              <X className="h-5 w-5 text-black" />
            </button>

            <div className="space-y-6">
              <h1 className="text-xl font-bold">Post a Tweet</h1>
              {!accessToken ? (
                <div className="space-y-4">
                  <motion.button
                    onClick={handleAuth}
                    className="w-full py-4 bg-black text-white border-2 border-black hover:bg-white hover:text-black transition-all font-bold uppercase"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Authenticate with Twitter
                  </motion.button>

                  <div className="space-y-2">
                    <p className="text-center">Enter the PIN code provided by Twitter:</p>
                    <input
                      type="text"
                      value={pinCode}
                      onChange={(e) => setPinCode(e.target.value)}
                      placeholder="Enter PIN code"
                      className="w-full p-2 border-2 border-black text-black rounded"
                    />
                    <motion.button
                      onClick={handlePinSubmit}
                      className="w-full py-4 bg-white text-black border-2 border-black hover:bg-black hover:text-white transition-all font-bold uppercase"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Submit PIN
                    </motion.button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col h-full">
  <div className="flex flex-row space-x-4 flex-grow">
    <p className="w-1/2 p-2 border-2 border-black text-black rounded">
      {tweetText}
    </p>
    <img
      src={`https://${nft?.metadata?.coverImage.replace('ipfs://', '')}.ipfs.dweb.link`}
      className="w-1/4"
    />
  </div>
  <div className="flex flex-col space-y-4 mt-4">
    <motion.button
      onClick={uploadImages}
      className="w-full py-4 bg-black text-white border-2 border-black hover:bg-white hover:text-black transition-all font-bold uppercase"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      Upload Images
    </motion.button>
    <motion.button
      onClick={handlePostTweet}
      className="w-full py-4 bg-black text-white border-2 border-black hover:bg-white hover:text-black transition-all font-bold uppercase"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      Post Tweet
    </motion.button>
  </div>
</div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
  };

export default PostTweet;