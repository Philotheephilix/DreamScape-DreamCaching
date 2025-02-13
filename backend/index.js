const express = require('express');
const bodyParser = require('body-parser');
const { Agent } = require('@fileverse/agents');
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use(bodyParser.json());

const agent = new Agent({ 
  chain: "sepolia", 
  pinataJWT: process.env.VITE_PUBLIC_PINATA_JWT, 
  pinataGateway: process.env.VITE_PUBLIC_GATEWAY_URL, 
  pimlicoAPIKey: process.env.VITE_PUBLIC_PIMLICO_API_KEY,
});
var count=14;
async function storeImageOnIPFS(imageBuffer) {
    try {
      await agent.setupStorage('Lucid-vision-namespaces-'+count.toString());
  
      const file = await agent.create(imageBuffer);
  
      console.log('File created:', file);
  
      const retrievedFile = await agent.getFile(file.fileId);
      console.log('File retrieved:', retrievedFile);
  
      return retrievedFile.contentIpfsHash;
    } catch (error) {
      console.error('Error storing image on IPFS:', error);
    }
  }
  
  // Route to handle base64 image upload
  app.post('/upload-image', async (req, res) => {
    try {
      const { base64Image } = req.body;
  
      if (!base64Image) {
        return res.status(400).json({ error: 'No base64 image provided' });
      }

      // Decode the base64 image directly into a buffer
      const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');
      const imageBuffer = Buffer.from(base64Data, 'base64');
      const tempImagePath = path.join(__dirname, 'temp_image.png');
      fs.writeFileSync(tempImagePath, imageBuffer);
      // Store the image on IPFS
      const fileId = await storeImageOnIPFS(imageBuffer);
  
      // Return the file ID
      res.json({ fileId });
    } catch (error) {
      console.error('Error processing image:', error);
      res.status(500).json({ error: 'Failed to process image' });
    }
  });
  
    
// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});