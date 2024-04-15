const process = require('process')
const { MongoClient } = require('mongodb');

yourConnectionURI = "mongodb+srv://" + process.env.DB_USERNAME + ":" + process.env.DB_PASSWORD + "@skedcluster.rr2li5f.mongodb.net/?retryWrites=true&w=majority"

const client = new MongoClient(yourConnectionURI);

// Object for storing a request entry
//
// Parameters:
// Date should be in the form mM/dD/yyYY
// Time should be in form XX:XX (military time) between 6:00 and 17:00 inclusive
class Request_Entry
{
    constructor(date, faculty_first, faculty_last, status, student_first, student_last, time)
    {
        this.date = date;
        this.faculty_first = faculty_first;
        this.faculty_last = faculty_last;
        this.status = status;
        this.student_first = student_first;
        this.student_last = student_last;
        this.time = time;
    }
}

// Object for storing an Availability entry
//
// Parameters:
// object should be in form: {"monday": [12 booleans], "tuesday": [12 booleans], "wednesday": [12 booleans], "thursday": [12 booleans], "friday": [12 booleans]}
// The boolean arrays correspond to [6:00, 7:00, 8:00, ... 15:00, 16:00, 17:00],
// but should just be 12 booleans [true, false, true...]
class Availability
{
    constructor(object)
    {
        this.monday = object.monday;
        this.tuesday = object.tuesday;
        this.wednesday = object.wednesday;
        this.thursday = object.thursday;
        this.friday = object.friday;
    }
}

// Converts 0-11 index to 5:00-17:00 format
function index_to_time(index)
{
    return`${index + 6}:00`;
}

// Forms strings for monday through friday in order to display availabilities
function form_avail_string(availability)
{
    if (availability instanceof Availability)
    {
        monday_string = "";
        tuesday_string = "";
        wednesday_string = "";
        thursday_string = "";
        friday_string = "";
        for (idx = 0; idx < 12; idx++)
        {
            if(availability.monday[idx])
            {
                monday_string += `${index_to_time(idx)} `;
            }
            if(availability.tuesday[idx])
            {
                tuesday_string += `${index_to_time(idx)} `;
            }
            if(availability.wednesday[idx])
            {
                wednesday_string += `${index_to_time(idx)} `;
            }
            if(availability.thursday[idx])
            {
                thursday_string += `${index_to_time(idx)} `;
            }
            if(availability.friday[idx])
            {
                friday_string += `${index_to_time(idx)} `;
            }
        }
        return {
            monday: monday_string,
            tuesday: tuesday_string,
            wednesday: wednesday_string,
            thursday: thursday_string,
            friday: friday_string
        };
    }
    else
    {
        console.log("Improperly formatted availability.");
        return "Improperly formatted availability.";
    }
}

// Object for storing a faculty entry
//
// Parameters:
// availability should be an Availability object
class Faculty_Entry
{
    constructor(email, availability, first, last)
    {
        this.email = email;
        if (availability instanceof Availability)
        {
            this.availability = structuredClone(availability);
        }
        else
        {
            this.availability =
                {
                               // 06:00, 07:00, 08:00, 09:00, 10:00, 11:00, 12:00, 13:00, 14:00, 15:00, 16:00, 17:00
                    "monday":    [false, false, false, false, false, false, false, false, false, false, false, false],
                    "tuesday":   [false, false, false, false, false, false, false, false, false, false, false, false],
                    "wednesday": [false, false, false, false, false, false, false, false, false, false, false, false],
                    "thursday":  [false, false, false, false, false, false, false, false, false, false, false, false],
                    "friday":    [false, false, false, false, false, false, false, false, false, false, false, false]
                }
        }
        this.first = first;
        this.last = last;
    }
}

// Function for getting a database entry
//
// Parameters:
// type: either faculty or requests
// query: object in the form of {<entry_key 1>:<entry value 1>, ...}
//
// Returns:
// A single database entry if given a query
// All entries otherwise
async function database_get(type, query)
{
    const database = client.db("test-data");
    const collection = database.collection(type);

    var data;

    data = (query === undefined) ?
        await collection.find().toArray() : await collection.findOne(query);

    return data;
}

// Function for adding a request entry
//
// request: a Request_Entry object with appropriate fields
async function database_add_request(request)
{
    if ((request instanceof Request_Entry) == false)
    {
        console.log(`Request improperly formatted, ${request}`);
        return;
    }

    const database = client.db("test-data");
    const collection = database.collection("requests");

    const document =
    {
        date: request.date,
        facultyFirst: request.faculty_first,
        facultyLast: request.faculty_last,
        status: request.status,
        studentFirst: request.student_first,
        studentLast: request.student_last,
        time: request.time
    };

    const result = await collection.insertOne(document);

    console.log(`A document was inserted with the _id: ${result.insertedId}`);
}

// Function for adding a faculty entry
//
// faculty: a Faculty_Entry object with appropriate fields
async function database_add_faculty(faculty)
{
    if ((faculty instanceof Faculty_Entry) == false)
    {
        console.log(`Faculty improperly formatted, ${faculty}`);
        return;
    }

    const database = client.db("test-data");
    const collection = database.collection("faculty");

    const document =
    {
        email: faculty.email,
        availability:
        {
            "monday": faculty.availability.monday,
            "tuesday":faculty.availability.tuesday,
            "wednesday": faculty.availability.wednesday,
            "thursday": faculty.availability.thursday,
            "friday": faculty.availability.friday
        },
        facultyFirst: faculty.first,
        facultyLast: faculty.last,
    };

    const result = await collection.insertOne(document);

    console.log(`A document was inserted with the _id: ${result.insertedId}`);
}

// Function for updating a single entry
//
// Parameters:
// type: "faculty" or "requests"
// query: a query on the database in the form {<entry key>:"<entry value>"}
// new_value: value to be changed in the form {<entry key 1>:"<entry value 1>", <entry key 2>: "entry value 2>", ...}
//
// EXAMPLE USAGE:
// database_update_entry("faculty", {facultyName: "David"}, {email: "dldillard@crimson.ua.edu"})
async function database_update_entry(type, query, new_value)
{
    const database = client.db("test-data");
    const collection = database.collection(type);

    const update_doc =
    {
        $set: new_value
    }

    const result = await collection.updateOne(query, update_doc);

    console.log(`${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`);
}

// Function for deleting a single entry
//
// Parameters:
// type: "faculty" or "requests"
// query: a query on the database in the form {<entry key>:"<entry value>"}
async function database_delete_entry(type, query)
{
    await client.connect();

    const database = client.db("test-data");
    const collection = database.collection(type);

    const result = await collection.deleteOne(query);

    console.log(`${result.deletedCount} document(s) deleted`);
}

// Should close the mongodb connection upon app close
process.on('SIGINT', function() {
    client.close(function () {
      console.log('MongoDB disconnected on app termination');
      process.exit(0);
    });
  });

module.exports =
{
    Request_Entry,
    Availability,
    form_avail_string,
    Faculty_Entry,
    database_get,
    database_add_request,
    database_add_faculty,
    database_update_entry,
    database_delete_entry
}
