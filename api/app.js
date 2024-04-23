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
    var { query, update } = req.body;

    try
    {
        console.log(query);
        console.log(update);

        query = {'_id': database.database_to_id_object(query._id)};

        database.database_update_entry("requests", query, update);

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