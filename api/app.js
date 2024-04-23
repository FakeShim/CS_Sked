const database = require('./database.js');
const express = require('express');
const cors = require('cors');

const app = express();
const port = 443;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

    const entry = database.database_get_entry_by_field("requests", "email", email);

    entry.then(function(result) {
        console.log(result);
        res.json(result);
    });
});

app.put('/update-requests', (req, res) => {
    const requestID = req.body.id;
    const { status, req: selectedTime } = req.body;

    try {
        database.database_update_entry("requests", { _id: requestID }, { status, req: selectedTime });

        res.status(200).json({ message: 'Request updated successfully' });
    }
    catch (error) {
        console.error('Error updating request:', error);
    }
});


app.put('/update-faculty', (req, res) => {

    const { query, new_value } = req.body;

    try
    {
        console.log(query);
        console.log(new_value);

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

app.post('/add-faculty', (req, res) => {




})


app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})