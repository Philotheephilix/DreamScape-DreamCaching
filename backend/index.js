const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const OAuth = require('oauth-1.0a');
const crypto = require('crypto');
const cors = require('cors');
const dotenv = require('dotenv');
const app = express();
const { v4: uuidv4 } = require('uuid');
const FormData = require('form-data');

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json());
const port = 5000;
dotenv.config();
app.use(cors());
app.use(express.json());
const { Agent } = require('@fileverse/agents');
require('dotenv').config();


// OAuth 1.0a setup
const oauth = OAuth({
  consumer: {
    key: process.env.TWITTER_API_KEY,
    secret: process.env.TWITTER_API_SECRET,
  },
  signature_method: 'HMAC-SHA1',
  hash_function: (baseString, key) =>
    crypto.createHmac('sha1', key).update(baseString).digest('base64'),
});

let requestToken = ''; // Store the request token in memory

app.get('/auth/twitter', (req, res) => {
  const requestTokenURL = 'https://api.twitter.com/oauth/request_token';
  const authURL = 'https://api.twitter.com/oauth/authenticate';

  const authHeader = oauth.toHeader(
    oauth.authorize({
      url: requestTokenURL,
      method: 'POST',
      data: { oauth_callback: 'oob' }, // Use 'oob' for desktop/non-web apps
    })
  );

  axios
    .post(requestTokenURL, null, {
      headers: {
        Authorization: authHeader['Authorization'],
      },
    })
    .then((response) => {
      const { oauth_token } = Object.fromEntries(new URLSearchParams(response.data));
      requestToken = oauth_token; // Store the request token
      res.redirect(`${authURL}?oauth_token=${oauth_token}`);
    })
    .catch((error) => {
      console.error('Error getting request token:', error.response ? error.response.data : error.message);
      res.status(500).send('Error during Twitter authentication');
    });
});

app.get('/callback', async (req, res) => {
  const { oauth_verifier } = req.query; // PIN code from the user
  const accessTokenURL = 'https://api.twitter.com/oauth/access_token';

  if (!requestToken) {
    return res.status(400).send('Request token missing. Please restart the OAuth flow.');
  }

  const authHeader = oauth.toHeader(
    oauth.authorize({
      url: accessTokenURL,
      method: 'POST',
      data: { oauth_token: requestToken, oauth_verifier },
    })
  );

  try {
    const response = await axios.post(accessTokenURL, null, {
      headers: {
        Authorization: authHeader['Authorization'],
      },
    });

    const { oauth_token: accessToken, oauth_token_secret: accessTokenSecret } = Object.fromEntries(
      new URLSearchParams(response.data)
    );

    // Return tokens to the frontend (for demo purposes only; in production, store securely)
    res.json({ accessToken, accessTokenSecret });
  } catch (error) {
    console.error('Error getting access token:', error.response ? error.response.data : error.message);
    res.status(500).send('Error during Twitter callback');
  }
});

app.post('/tweet', async (req, res) => {
  const { accessToken, accessTokenSecret, text, mediaIds } = req.body;
  const url = 'https://api.twitter.com/2/tweets';

  const authHeader = oauth.toHeader(
    oauth.authorize(
      {
        url,
        method: 'POST',
      },
      {
        key: accessToken,
        secret: accessTokenSecret,
      }
    )
  );

  try {
    const response = await axios.post(
      url,
      {
        text,
        media: mediaIds ? { media_ids: mediaIds } : undefined,
      },
      {
        headers: {
          Authorization: authHeader['Authorization'],
          'Content-Type': 'application/json',
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error('Error posting tweet:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Error posting tweet' });
  }
});

const agent = new Agent({ 
  chain: "sepolia", 
  pinataJWT: process.env.VITE_PUBLIC_PINATA_JWT, 
  pinataGateway: process.env.VITE_PUBLIC_GATEWAY_URL, 
  pimlicoAPIKey: process.env.VITE_PUBLIC_PIMLICO_API_KEY,
});
var count=100;
async function storeJsonOnIPFS(jsonData) {
  try {
      await agent.setupStorage('Lucid-visioasddsn-namespaces-' + count.toString());

      // Convert JSON data to a buffer
      const jsonBuffer = Buffer.from(JSON.stringify(jsonData));

      // Create a file with the JSON buffer
      const file = await agent.create(jsonBuffer);

      console.log('File created:', file);

      // Retrieve the file to get the IPFS hash
      const retrievedFile = await agent.getFile(file.fileId);
      console.log('File retrieved:', retrievedFile);

      // Return the IPFS hash of the JSON file
      return retrievedFile.contentIpfsHash;
  } catch (error) {
      console.error('Error storing JSON on IPFS:', error);
      throw error; // Re-throw the error to handle it in the calling function
  }
}

app.post('/upload-json', async (req, res) => {
  try {
      const { metadata } = req.body;

      if (!metadata) {
          return res.status(400).json({ error: 'No metadata provided' });
      }

      // Store the metadata (JSON) on IPFS
      const fileId = await storeJsonOnIPFS(metadata);

      // Return the file ID (IPFS hash)
      res.json({ fileId });
  } catch (error) {
      console.error('Error processing metadata:', error);
      res.status(500).json({ error: 'Failed to process metadata' });
  }
});
async function storeImageOnIPFS(imageBuffer) {
    try {
      await agent.setupStorage('Lucid-visioasddsn-namespaces-'+count.toString());
  
      const file = await agent.create(imageBuffer);
  
      console.log('File created:', file);
  
      const retrievedFile = await agent.getFile(file.fileId);
      console.log('File retrieved:', retrievedFile);
  
      return retrievedFile.contentIpfsHash;
    } catch (error) {
      console.error('Error storing image on IPFS:', error);
    }
  }
  app.post('/upload-image', async (req, res) => {
    try {
      const { base64Image } = req.body;
  
      if (!base64Image) {
        return res.status(400).json({ error: 'No base64 image provided' });
      }

      // Decode the base64 image directly into a buffer
      const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');
      const imageBuffer = Buffer.from(base64Data, 'base64');
      const fileId = await storeImageOnIPFS(imageBuffer);
  
      // Return the file ID
      res.json({ fileId });
    } catch (error) {
      console.error('Error processing image:', error);
      res.status(500).json({ error: 'Failed to process image' });
    }
  });
  

app.post('/upload-media', async (req, res) => {
  const { accessToken, accessTokenSecret, images } = req.body; // `images` is an array of base64 strings
  const mediaUploadURL = 'https://upload.twitter.com/1.1/media/upload.json';

  try {
    const mediaIds = await Promise.all(
      images.map(async (image) => {
        const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
        const imageBuffer = Buffer.from(base64Data, 'base64');

        const authHeader = oauth.toHeader(
          oauth.authorize(
            {
              url: mediaUploadURL,
              method: 'POST',
            },
            {
              key: accessToken,
              secret: accessTokenSecret,
            }
          )
        );

        const formData = new FormData();
        formData.append('media', imageBuffer, { filename: `${uuidv4()}.jpg` });

        const response = await axios.post(mediaUploadURL, formData, {
          headers: {
            ...authHeader,
            ...formData.getHeaders(),
          },
        });

        return response.data.media_id_string;
      })
    );

    res.json({ mediaIds });
  } catch (error) {
    console.error('Error uploading media:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Error uploading media' });
  }
});
    
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});