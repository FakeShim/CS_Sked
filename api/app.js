//const database = require('./database.js');
const express = require('express');
const cors = require('cors');

const app = express();
const port = 443;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/home', (req, res) => {
    res.json({
        "email": "bhngyen3@crimson.ua.edu",
        "availability": {
            "monday": [true, true, true, false, true, false, true, false, true, false, true, false],
            "tuesday": [true, false, true, false, true, false, true, false, true, false, true, false],
            "wednesday": [true, false, true, false, true, false, true, false, true, false, true, false],
            "thursday": [true, false, true, false, true, false, true, false, true, false, true, false],
            "friday": [true, false, true, false, true, false, true, false, true, false, true, false]
        },
        "facultyFirst": "Brandon",
        "facultyLast": "Nguyen"
    })
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})