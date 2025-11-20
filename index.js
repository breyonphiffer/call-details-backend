// server/index.js
const express = require('express');
const ImageKit = require('imagekit');
require('dotenv').config()
const app = express();

const port = process.env.PORT || 5000;
const urlEndpoint = process.env.URL_ENDPOINT || '';
const publicKey = process.env.PUBLIC_KEY || '';
const privateKey = process.env.PRIVATE_KEY || '';

// --- Hardcoded Users (Simulating Database) ---
const users = [
  { email: 'admin@callanalytics.com', password: 'aN@lytics!2023#Secure', role: 'admin' },
  { email: 'viewer1@callanalytics.com', password: '5tr0ng@nalYtics*Pass', role: 'viewer' },
  { email: 'viewer2@callanalytics.com', password: '@n@lytics#P@s5W0rd!88', role: 'viewer' }
];

const key = 'a4f3b8e6-ec7c-4ff6-b54a-3c10798f58a2';

function setCorsHeaders(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS'); // Added OPTIONS here
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // 1. Check if the request is a preflight (OPTIONS method)
  if (req.method === 'OPTIONS') {
    // 2. Respond immediately with status 200 (OK) to preflight
    return res.sendStatus(200); 
  }

  // 3. For all other requests (GET, POST, etc.), continue to the route handler
  next();
}

app.use(setCorsHeaders);

app.use(express.json());

const imagekit = new ImageKit({
  urlEndpoint,
  publicKey,
  privateKey
});

app.get('/auth', (req, res) => {
  const keyHeader = req.headers['key'];

  // Check if the header is present
  if (!keyHeader) {
    res.status(400).send('Key header not found');
  }
  
  if(keyHeader !== key){
    res.status(401).send('Invalid key header!');
  }

  const result = imagekit.getAuthenticationParameters();
  res.send(result);
});

// --- New Login POST Route ---
app.post('/login', (req, res) => {
  // Extract email and password from the request body
  const { email, password } = req.body;

  // 1. Find the user by email
  const user = users.find(u => u.email === email);

  // 2. Check if user exists and password matches
  if (user && user.password === password) {
    // Successful login: Create a new object excluding the password
    const { password: _, ...userData } = user;

    let resp = {
      message: 'Login successful',
      user: userData,
    }

    if (user.role === 'admin') {
      resp.key = key;
    }

    return res.status(200).json(resp);
  }

  // Failed login
  return res.status(401).json({ message: 'Invalid email or password' });
});
// -----------------------------

app.listen(port, () => {
  console.log('Authentication server running on port: ', port);
});