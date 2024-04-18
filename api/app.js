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

app.post('/add-faculty', (req, res) => {




})

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})