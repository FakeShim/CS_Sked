const express = require('express');
var cors = require('cors');
const db = require('../database.js');

//start the app if needed
const app = express();

// set up CORS and JSON middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//function to compare the student's availability with the professor's availability
function compareAvailability(studentAvailability, userData) {
    let comparisonResults = [];

    // Loop through the userData
    for (let user of userData) {
        let matches = {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            availability: []
        };

        // Check each day in the user's availability
        for (let availableDay of user.availability) {
            // Check if the user is available on the same day as the student
            if (studentAvailability[availableDay.day]) {
                let studentTimes = studentAvailability[availableDay.day];
                let matchingTimes = availableDay.times.reduce((acc, userTime, index) => {
                    if (userTime && studentTimes.includes(index + 6 + ':00')) { // Adjust index based on time slots starting at 6:00 AM
                        acc.push(index + 6 + ':00');
                    }
                    return acc;
                }, []);

                // If there are matching times, add it to the matches object
                if (matchingTimes.length > 0) {
                    matches.availability.push({ day: availableDay.day, times: matchingTimes });
                }
            }
        }

        // If there are matches, add it to the comparisonResults
        if (matches.availability.length > 0) {
            comparisonResults.push(matches);
        }
    }
    return comparisonResults;
}

app.post('/faculty-availability', (req, res) => {
    const studentAvailability = req.body;
    let facultyData;
    //compare the student availability with the mockUsersData
    try {
        facultyData = db.database_get('faculty', {});
        const comparisonResults = compareAvailability(studentAvailability, facultyData);
        res.status(200).json(comparisonResults);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching faculty availability' });
    }
});

//change port if needed
app.listen(3001, () => {
    console.log('Server is running on port 3001');
});

module.exports = app;