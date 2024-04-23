const express = require('express')
const bcrypt = require('bcrypt')
var cors = require('cors')
const jwt = require('jsonwebtoken')
var low = require('lowdb')
var FileSync = require('lowdb/adapters/FileSync')
var adapter = new FileSync('./database.json')
var db = low(adapter)
const database = require('./database.js');
const { exec } = require('child_process');

// Initialize Express app
const app = express()

const port = process.env.PORT || 443;

// Define a JWT secret key. This should be isolated by using env variables for security
const jwtSecretKey = process.env.JWT_SECRET || 'defaultSecretKey';

// Set up CORS and JSON middlewares
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Basic home route for the API
app.get('/', (_req, res) => {
    res.send('Auth API.\nPlease use POST /auth & POST /verify for authentication')
  })

// Authentication endpoint using MongoDB Atlas
app.post('/auth', async (req, res) => {
  const { email, password } = req.body;

  const user = await database.database_login({ email });

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
  const tokenHeaderKey = 'jwt-token'
  const authToken = req.headers[tokenHeaderKey]
  try {
    const verified = jwt.verify(authToken, jwtSecretKey)
    if (verified) {
      return res.status(200).json({ status: 'logged in', message: 'success' })
    } else {
      // Access Denied
      return res.status(401).json({ status: 'invalid auth', message: 'error' })
    }
  } catch (error) {
    // Access Denied
    return res.status(401).json({ status: 'invalid auth', message: 'error' })
  }
})

// An endpoint to see if there's an existing account for a given email address
app.post('/check-account', (req, res) => {
  const { email } = req.body

  console.log(req.body)

  const user = db
    .get('users')
    .value()
    .filter((user) => email === user.email)

  console.log(user)

  res.status(200).json({
    status: user.length === 1 ? 'User exists' : 'User does not exist',
    userExists: user.length === 1,
  })
})

const sendEmail = (recip, subject, body) => {
  //const command = `echo "${body}" | mail -s "${subject}" ${recip}`;
  const command = `echo -e "To: ${recip}\nFrom: devschedulercs495@outlook.com\n\nSubject: ${subject}\n${body}" | ssmtp -f"devschedulercs495@outlook.com" -F"devschedulercs495@outlook.com" -v ${recip}`;
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

app.get('/get-all-faculty', (req, res) => {
  const entries = database.database_get("faculty");

  entries.then(function(result) {
      console.log(result);
      res.json(result);
  });
});

app.get('/get-all-requests', (req, res) => {
    const entries = database.database_get("requests");

    entries.then(function(result) {
        console.log(result);
        res.json(result);
    });
});

app.get('/get-request-by-email', (req, res) => {
    const { email } = req.query;

    const entry = database.database_get_multiple("requests", {"email": email});

    entry.then(function(result) {
        console.log(result);
        res.json(result);
    });
});

app.put('/update-requests', (req, res) => {
    var { query, new_value } = req.body;

    try
    {
        console.log("query: ", query);
        console.log("new_value: ",new_value);

        query = {'_id': database.database_to_id_object(query._id)};

        database.database_update_entry("requests", query, new_value);

        res.status(200).json({ message: 'Confirmation Entry updated successfully' });
    }
    catch (error)
    {
        console.log("ERROR: ", req.body);
        console.error('Error confirming entry:', error);
    }

});


app.put('/update-faculty', (req, res) => {

    var { query, new_value } = req.body;

    try
    {
        console.log(query);
        console.log(new_value);

        query = {'_id': database.database_to_id_object(query._id)};

        if ('availability' in new_value)
        {
            new_value.availability = database.num_to_bool(new_value.availability);
        }

        database.database_update_entry("faculty", query, new_value);

        res.status(200).json({ message: 'Entry updated successfully' });
    }
    catch (error)
    {
        console.log("ERROR: ", req.body);
        console.error('Error updating entry:', error);
    }


});

app.put('/delete-requests', (req, res) => {

    const { query } = req.body;

    try
    {

        database.database_delete_entry("requests", query);

        res.status(200).json({ message: 'Entry deleted successfully' });
    }
    catch (error)
    {
        console.log("ERROR: ", req.body);
        console.error('Error updating entry:', error);
    }


});

app.put('/delete-faculty', (req, res) => {

    var query = req.body;

    try
    {
        query = {'_id': database.database_to_id_object(query._id)};

        database.database_delete_entry("faculty", query);

        res.status(200).json({ message: 'Entry deleted successfully' });
    }
    catch (error)
    {
        console.log("ERROR: ", req.body);
        console.error('Error deleting entry:', error);
    }
})

app.get('/add-blank-faculty', (req, res) => {

    new_entry = new database.Faculty_Entry("", "", "", "");

    const returned_id = database.database_add_faculty(new_entry);

    returned_id.then(function(result) {
        console.log(result);
        res.json(result);
    });
})


app.listen(port, () => {
  console.log(`Listening on port ${port}`);
})