// server/index.js
const express = require('express');
const ImageKit = require('imagekit');
const cors = require('cors');
require('dotenv').config()
const app = express();

const port = process.env.PORT || 5000;
const urlEndpoint = process.env.URL_ENDPOINT || '';
const publicKey = process.env.PUBLIC_KEY || '';
const privateKey = process.env.PRIVATE_KEY || '';


app.use(cors());

const imagekit = new ImageKit({
  urlEndpoint,
  publicKey,
  privateKey
});

app.get('/auth', (req, res) => {
  const result = imagekit.getAuthenticationParameters();
  res.send(result);
});

app.listen(port, () => {
  console.log('Authentication server running on port: ', port);
});