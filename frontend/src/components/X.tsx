import React, { useState } from 'react';
import axios from 'axios';

interface TwitterAuthResponse {
  accessToken: string;
  accessTokenSecret: string;
}

const PostTweet: React.FC = () => {
  const [tweetText, setTweetText] = useState<string>('');
  const [accessToken, setAccessToken] = useState<string>('');
  const [accessTokenSecret, setAccessTokenSecret] = useState<string>('');
  const [pinCode, setPinCode] = useState<string>('');
  const [images, setImages] = useState<File[]>([]);
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
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error during callback:', error.response?.data || error.message);
      } else {
        console.error('Unexpected error:', error);
      }
    }
  };

  const handleImageUpload = (files: FileList) => {
    const newImages = Array.from(files);
    setImages((prevImages) => [...prevImages, ...newImages]);
  };

  const uploadImages = async () => {
    const base64Images = await Promise.all(
      images.map((file) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => {
            resolve(reader.result as string);
          };
        });
      })
    );

    try {
      const response = await axios.post('http://localhost:5000/upload-media', {
        accessToken,
        accessTokenSecret,
        images: base64Images,
      });
      setMediaIds(response.data.mediaIds);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error uploading images:', error.response?.data || error.message);
      } else {
        console.error('Unexpected error:', error);
      }
    }
  };

  const handlePostTweet = async () => {
    try {
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
    <div>
      <h1>Post a Tweet</h1>
      {!accessToken ? (
        <div>
          <button onClick={handleAuth}>Authenticate with Twitter</button>
          <div>
            <p>Enter the PIN code provided by Twitter:</p>
            <input
              type="text"
              value={pinCode}
              onChange={(e) => setPinCode(e.target.value)}
              placeholder="Enter PIN code"
            />
            <button onClick={handlePinSubmit}>Submit PIN</button>
          </div>
        </div>
      ) : (
        <div>
          <textarea
            value={tweetText}
            onChange={(e) => setTweetText(e.target.value)}
            placeholder="What's happening?"
          />
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                handleImageUpload(e.target.files);
              }
            }}
          />
          <button onClick={uploadImages}>Upload Images</button>
          <button onClick={handlePostTweet}>Post Tweet</button>
        </div>
      )}
    </div>
  );
};

export default PostTweet;