const express = require('express');
var cors = require('cors');

//start the app if needed
const app = express();

// set up CORS and JSON middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//in memory database for right now
const db = {
    students:
        [],
};


//professor data
const mockUsersData = [
    {
      firstName: "Brandon",
      lastName: "Nguyen",
      email: "bhnguyen1@crimson.ua.edu",
      availability: [
        {
          day: "Monday",
          times: [
            { Start: "8:00", End: "9:00", available: true },
            { Start: "9:00", End: "10:00", available: true }
          ]
        },
        {
          day: "Tuesday",
          times: [
            { Start: "10:00", End: "11:00", available: true },
            { Start: "11:00", End: "12:00", available: true }
          ]
        }
        // ... other days
      ]
    },
    {
      firstName: "John",
      lastName: "Doe",
      email: "jdoe4@ua.edu",
      availability: [
        {
          day: "Monday",
          times: [
            { Start: "9:00", End: "10:00", available: true },
            { Start: "10:00", End: "11:00", available: true }
          ]
        },
        {
          day: "Wednesday",
          times: [
            { Start: "10:00", End: "11:00", available: true },
            { Start: "11:00", End: "12:00", available: true }
          ]
        }
        // ... other days
      ]
    }
    // ... other users
];

//function to compare the student's availability with the professor's availability
function compareAvailability(studentAvailability, userData) {
    let comparisonResults = [];

    //loop through the userData
    for (let user of userData) {
        let matches = {
            firstName : user.firstName,
            lastName : user.lastName,
            email : user.email,
            availability: []
        };

        //check each day in the user's availability
        for (let availableDay of user.availability) {
            //check if the user is available on the same day as the student
            if (studentAvailability.day == availableDay.day) {
                //filter the times that the user is available and match it with the student's availability
                let matchingTimes = availableDay.times.filter(userTime => {
                    return userTime.available && 
                        studentAvailability.times.Start == userTime.Start &&
                        studentAvailability.times.End == userTime.End;
                });
                
                //if there are matching times, add it to the matches object
                if (matchingTimes.length > 0) {
                    matches.availability.push({ day: availableDay.day, times: matchingTimes });
                }
            }
        }
        
        //if there are matches, add it to the comparisonResults
        if (matches.availability.length > 0) {
            comparisonResults.push(matches);
        }
    }
    return comparisonResults;
}

// Basic home route for the API
app.get('/', (_req, res) => {
    res.send('CS Sked API.\nPlease use POST /students for student data')
});

// The students endpoint that creates a new student record
app.post('/students', (req, res) => {
    const student = req.body;
    db.students.push(student);
    res.status(200).json({ message: 'successfully addded new student' });
});

app.get('/professor', (req, res) => {
    res.status(200).json(mockUsersData);
});

app.post('/professors-availability', (req, res) => {
    const studentAvailability = req.body;
    //compare the student availability with the mockUsersData
    const comparisonResults = compareAvailability(studentAvailability, mockUsersData);
    res.status(200).json(comparisonResults);
});

//change port if needed
app.listen(3001, () => {
    console.log('Server is running on port 3001');
});