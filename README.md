# DreamScape

DreamScape is an innovative platform that combines **AI**, **blockchain**, and **social integration** to help users analyze, visualize, and share their dreams. The app transcribes dream dictations, generates scene-by-scene comic book illustrations, creates personalized Spotify playlists, and mints dreams as NFTs stored on IPFS. It also integrates with Twitter/X for social sharing.

---

## Features

- **Speech-to-Text (STT)**: Converts dream dictations into text using Python-based STT models.
- **AI Image Generation**: Generates scene-by-scene comic book illustrations from dream text using Python.
- **Spotify Playlist Generation**: Creates personalized playlists based on dream analysis.
- **IPFS Storage**: Stores dream data and images on IPFS using Express.js.
- **Twitter/X Integration**: Automatically posts dream summaries or comics to Twitter/X.
- **NFT Minting**: Mints dreams as NFTs on the blockchain, ensuring user ownership and immutability.

---

## Tech Stack

### Frontend
- **Vite.js**: A fast and modern frontend build tool for a seamless user experience.
- **React**: For building the user interface and managing state.

### Backend
- **Python**: Handles AI tasks like Speech-to-Text (STT), image generation, and Spotify playlist creation.
- **Express.js**: Manages IPFS storage, Twitter/X integration, and serves as the backend API.

### APIs and Libraries
- **Venice.AI API**: For advanced AI-driven dream analysis and image generation.
- **Spotify API**: For creating personalized playlists.
- **Twitter/X API**: For social media integration.
- **IPFS**: For decentralized storage of dream data and images.
- **EigenLayer**: For secure data transfer and smart contract interactions.

---

## Project Architecture

### Frontend (Vite.js + React)
- **User Interface**: Allows users to dictate dreams, view dream comics, and interact with their NFT collection.
- **API Calls**: Communicates with the backend to send dream dictations and retrieve analyzed data.

### Backend (Python + Express.js)
1. **Python**:
   - **Speech-to-Text (STT)**: Converts user dictations into text.
   - **Image Generation**: Uses AI to create comic book-style illustrations from dream text.
   - **Spotify Playlist Creation**: Analyzes dream content to generate mood-based playlists.

2. **Express.js**:
   - **IPFS Integration**: Stores dream data and images on IPFS.
   - **Twitter/X Integration**: Posts dream summaries or comics to Twitter/X.
   - **API Endpoints**: Provides endpoints for frontend-backend communication.

---

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- Python (v3.8 or higher)
- Spotify Developer Account (for API access)
- Twitter/X Developer Account (for API access)
- IPFS Node (local or remote)
- Venice.AI API Key

### Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/DreamScape.git
   cd DreamScape
   ```

2. **Frontend Setup**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Backend Setup**:
   - **Python**:
     ```bash
     cd backend/python
     pip install -r requirements.txt
     python3 app.py
     ```
   - **Express.js**:
     ```bash
     cd backend/express
     npm install
     npm start
     ```

4. **Environment Variables**:
   - Create a `.env` file in both `frontend` and `backend` directories.
   - Add the following variables:
     ```
     VENICE_API_KEY=your_venice_api_key
     CLIENT_ID=your_spotify_client_id
     CLIENT_SECRET=your_spotify_client_secret
     TWITTER_API_KEY=your_twitter_api_key
     TWITTER_API_SECRET=your_twitter_api_secret
     IPFS_NODE_URL=your_ipfs_node_url
     REDIRECT_URI = https://dreamscape-plum.vercel.app/
     PRIVATE_KEY=Your wallet private key
     VITE_PUBLIC_CONTRACT_ADDRESS=nft contract address
     VITE_PUBLIC_GATEWAY_URL=IPFS gateway url
     VITE_PUBLIC_PINATA_JWT=pinata jwt for authentication
     ```

5. **Run the Project**:
   - Start the frontend and backend servers.
   - Access the app at `http://localhost:5173`.

---

## Workflow

1. **User Dictates Dream**:
   - The frontend captures the user's dream dictation and sends it to the backend.

2. **Speech-to-Text (STT)**:
   - Python converts the dictation into text.

3. **AI Analysis**:
   - Venice.AI API analyzes the text for mental health insights and generates scene-by-scene comic book illustrations.

4. **Spotify Playlist**:
   - Python creates a personalized playlist based on the dream's emotional tone.

5. **IPFS Storage**:
   - Express.js uploads the dream data and images to IPFS.

6. **NFT Minting**:
   - The dream is minted as an NFT and stored on the blockchain.

7. **Social Sharing**:
   - Express.js posts the dream comic or summary to Twitter/X.

---

## Contributing

We welcome contributions! Please follow these steps:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature/YourFeature`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Open a pull request.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- **Venice.AI** for advanced AI capabilities.
- **IPFS** for decentralized storage.
- **Spotify** and **Twitter/X** for API integrations.
- **Vite.js** and **Express.js** for frontend and backend development.

---