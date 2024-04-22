const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { exec } = require('child_process');
const { MongoClient } = require('mongodb');
require('dotenv').config(); // Load environment variables

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const jwtSecretKey = process.env.JWT_SECRET || 'defaultSecretKey';
//MONGO PASSWORD NEEDS TO BE CHANGED BEFORE LAUNCH
const mongoUri = "mongodb://" + process.env.DB_USERNAME + ":" + process.env.DB_PASSWORD + "@data:27017/?retryWrites=true&w=majority"; // MongoDB Atlas connection string

// MongoDB Atlas connection setup
async function connectToMongo() {
  console.log('MongoDB URI:', mongoUri);
  console.log('jwtSK:', jwtSecretKey);
  const client = new MongoClient(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
  try {
    await client.connect();
    console.log('Connected to MongoDB Atlas');
    return client.db('test-data').collection('login'); 
  } catch (error) {
    console.error('Error connecting to MongoDB Atlas:', error);
    process.exit(1);
  }
}

// Authentication endpoint using MongoDB Atlas
app.post('/auth', async (req, res) => {
  const { email, password } = req.body;
  const usersCollection = await connectToMongo();

  const user = await usersCollection.findOne({ email });

  if (!user) {
    bcrypt.hash(password, 10, async (err, hash) => {
      if (err) {
        return res.status(500).json({ message: 'Error hashing password' });
      }
      const newUser = { email, password: hash };
      await usersCollection.insertOne(newUser);
      const token = jwt.sign({ email }, jwtSecretKey);
      res.status(200).json({ message: 'success', token });
    });
  } else {
    bcrypt.compare(password, user.password, (err, result) => {
      if (err || !result) {
        return res.status(401).json({ message: 'Invalid password' });
      }
      const token = jwt.sign({ email }, jwtSecretKey);
      res.status(200).json({ message: 'success', token });
    });
  }
});
// The verify endpoint that checks if a given JWT token is valid
app.post('/verify', (req, res) => {
  const tokenHeaderKey = 'jwt-token';
  const authToken = req.headers[tokenHeaderKey];
  try {
    const verified = jwt.verify(authToken, jwtSecretKey);
    if (verified) {
      return res.status(200).json({ status: 'logged in', message: 'success' });
    } else {
      // Access Denied
      return res.status(401).json({ status: 'invalid auth', message: 'error' });
    }
  } catch (error) {
    // Access Denied
    return res.status(401).json({ status: 'invalid auth', message: 'error' });
  }
});
const sendEmail = (recip, subject, body) => {
  const command = `echo "${body}" | mail -s "${subject}" ${recip}`;
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error sending email: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Email command encountered an error: ${stderr}`);
      return;
    }
    console.log('Email sent successfully');
  });
};

app.get('/send-email', (req, res) => {
  const { recip, subject, body } = req.query;
  if (!recip || !subject || !body) {
    return res.status(400).send('Missing recipient, subject, or body');
  }
  sendEmail(recip, subject, body);
  res.send('Email sent');
});

const port = process.env.PORT || 3080;
app.listen(port, () => {
  console.log('Server is running on port ${port}');
});
