const express = require('express')
const bcrypt = require('bcrypt')
var cors = require('cors')
const jwt = require('jsonwebtoken')
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

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header('Access-Control-Allow-Credentials', true);
  next();
});

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

const sendEmail = (recip, subject, body) => {
  //const command = `echo "${body}" | mail -s "${subject}" ${recip}`;
  const command = `echo -e "To:${recip} \n From:devschedulercs495@outlook.com \n Subject:${subject} \n\n ${body}" | ssmtp -f"devschedulercs495@outlook.com" -F"devschedulercs495@outlook.com" -v ${recip}`;
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

//function to compare the student's availability with the professor's availability
function compareAvailability(studentAvailability, userData) {

  try {
      var availableFaculty = [];

      console.log("userData", userData);

      for (var idx = 0; idx < userData.length; idx++)
      {
        facultyMember = userData[idx];

        var date = Object.keys(studentAvailability.times)[0];
        var day = date.split('-')[0];

        console.log("facultyMember: ", facultyMember);
        console.log("day: ", day)

        var availability = facultyMember.availability[day];
        var timeArray = studentAvailability.times[date];

        timesObject = {[date]: []};

        var isAvailable = false;

        for (jdx = 0; jdx < timeArray.length; jdx++)
        {
            var suffix = timeArray[jdx].split(' ')[1];
            var timeNum = parseInt(timeArray[jdx].split(':')[0]);
            if (suffix === "PM" && timeNum != 12)
            {
                timeNum += 12;
            }
            console.log("timeNum:", timeNum);
            console.log("availability:", availability);
            timeNum -= 6;
            if (availability[timeNum])
            {
                isAvailable = true;
                timesObject[date].push(timeArray[jdx])
            }
        }
        if (isAvailable)
        {
            console.log("isAvailable");
            var availableFacultyMember = {
              'facultyFirst': facultyMember.facultyFirst,
              'facultyLast': facultyMember.facultyLast,
              "email": facultyMember.email, 
              "times": timesObject};
            availableFaculty.push(availableFacultyMember);
        }
      }
      return availableFaculty;
  }
  catch (error)
  {
      console.log("error")
  }
    // Loop through the userData
    // for (var idx = 0; idx < userData.length; idx++) {
    //     var user = userData[idx];

    //     let matches = {
    //         firstName: user.firstName,
    //         lastName: user.lastName,
    //         email: user.email,
    //         availability: []
    //     };

    //     // Check each day in the user's availability
    //     for (var jdx = 0; jdx < user.availability.length; jdx++) {
    //         console.log(studentAvailability);
    //         // Check if the user is available on the same day as the student
    //         if (studentAvailability[availableDay.day]) {
    //             let studentTimes = studentAvailability[availableDay.day];
    //             let matchingTimes = availableDay.times.reduce((acc, userTime, index) => {
    //                 if (userTime && studentTimes.includes(index + 6 + ':00')) { // Adjust index based on time slots starting at 6:00 AM
    //                     acc.push(index + 6 + ':00');
    //                 }
    //                 return acc;
    //             }, []);

    //             // If there are matching times, add it to the matches object
    //             if (matchingTimes.length > 0) {
    //                 matches.availability.push({ day: availableDay.day, times: matchingTimes });
    //             }
    //         }
    //     }

    //     // If there are matches, add it to the comparisonResults
    //     if (matches.availability.length > 0) {
    //         comparisonResults.push(matches);
    //     }
    // }


}

app.post('/faculty-availability', (req, res) => {
    const studentAvailability = req.body;
    console.log("studentAvailability: ", studentAvailability)
    let facultyData;
    //compare the student availability with the mockUsersData
    try {
        facultyData = database.database_get('faculty');
        facultyData.then(function(result) {
          console.log(result);
          const availableFaculty = compareAvailability(studentAvailability, result);

          var requests = []
          if (Array.isArray(availableFaculty))
          {
            for (var idx = 0; idx < availableFaculty.length; idx++)
            {
              var faculty = availableFaculty[idx];

              console.log('faculty', faculty);

              var request = {
                'facultyFirst': faculty.facultyFirst,
                'facultyLast': faculty.facultyLast,
                'studentFirst': studentAvailability.name.split(' ')[0],
                'studentLast': studentAvailability.name.split(' ')[1],
                'email': faculty.email,
                'status': "Pending",
                'times': faculty.times
              } 

              console.log('request', request);

              requests.push(request);
            }
          }
          

          res.status(200).json(requests);
        });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching faculty availability' });
    }
});

app.post('/add-request', (req, res) => {
  var new_value = req.body;

    try
    {
        console.log("new_value: ", new_value);

        database.database_add_request(new_value);

        res.status(200).json({ message: 'Entry updated successfully' });
    }
    catch (error)
    {
        console.log("ERROR: ", req.body);
        console.error('Error updating entry:', error);
    }
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
})