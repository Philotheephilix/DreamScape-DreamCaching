const { Agent } = require('@fileverse/agents');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const agent = new Agent({ 
  chain: "sepolia", 
  pinataJWT: process.env.VITE_PUBLIC_PINATA_JWT, 
  pinataGateway: process.env.VITE_PUBLIC_GATEWAY_URL, 
  pimlicoAPIKey: process.env.VITE_PUBLIC_PIMLICO_API_KEY,
});

async function storeImageOnIPFS(imagePath) {
  try {
    const imageBuffer = fs.readFileSync(imagePath);

    await agent.setupStorage('my-namespace');

    const file = await agent.create(imageBuffer);

    console.log('File created:', file);

    const retrievedFile = await agent.getFile(file.fileId);
    console.log('File retrieved:', retrievedFile);

    return file.fileId;
  } catch (error) {
    console.error('Error storing image on IPFS:', error);
  }
}

const imagePath = path.join(__dirname, 'captured_image.png'); // Replace with your image file path  
storeImageOnIPFS(imagePath).then(fileId => {
  console.log('Image stored on IPFS with file ID:', fileId);
});