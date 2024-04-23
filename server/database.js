const process = require('process')
const { MongoClient } = require('mongodb');
const { ObjectId } = require ('bson');

yourConnectionURI = "mongodb+srv://" + process.env.DB_USERNAME + ":" + process.env.DB_PASSWORD + "@skedcluster.rr2li5f.mongodb.net/?retryWrites=true&w=majority"

const client = new MongoClient(yourConnectionURI);

const db_name = "scheduler"

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
// object should be in form: {"Monday": [12 booleans], "Tuesday": [12 booleans], "Wednesday": [12 booleans], "Thursday": [12 booleans], "Friday": [12 booleans]}
// The boolean arrays correspond to [6:00, 7:00, 8:00, ... 15:00, 16:00, 17:00],
// but should just be 12 booleans [true, false, true...]
class Availability
{
    constructor(object)
    {
        this.Monday = object.Monday;
        this.Tuesday = object.Tuesday;
        this.Wednesday = object.Wednesday;
        this.Thursday = object.Thursday;
        this.Friday = object.Friday;
    }
}

function num_to_bool(availability)
{
    var monday_array = [false, false, false, false, false, false, false, false, false, false, false, false];
    var tuesday_array = [false, false, false, false, false, false, false, false, false, false, false, false];
    var wednesday_array = [false, false, false, false, false, false, false, false, false, false, false, false];
    var thursday_array = [false, false, false, false, false, false, false, false, false, false, false, false];
    var friday_array = [false, false, false, false, false, false, false, false, false, false, false, false];

    if (availability.Monday !== undefined )
    {
        for (var idx of availability.Monday)
        {
            console.log('idx: ', idx);
            monday_array[parseInt(idx) - 6] = true;
        }
    }
    if (availability.Tuesday !== undefined )
    {
        for (var idx of availability.Tuesday)
        {
            console.log('idx: ', idx);
            tuesday_array[parseInt(idx) - 6] = true;
        }
    }
    if (availability.Wednesday !== undefined )
    {
        for (var idx of availability.Wednesday)
        {
            console.log('idx: ', idx);
            wednesday_array[parseInt(idx) - 6] = true;
        }
    }
    if (availability.Thursday !== undefined )
    {
        for (var idx of availability.Thursday)
        {
            console.log('idx: ', idx);
            thursday_array[parseInt(idx) - 6] = true;
        }
    }
    if (availability.Friday !== undefined )
    {
        for (var idx of availability.Friday)
        {
            console.log('idx: ', idx);
            friday_array[parseInt(idx) - 6] = true;
        }
    }

    console.log("monday_array:", monday_array);

    return {"Monday":monday_array, "Tuesday":tuesday_array, "Wednesday":wednesday_array, "Thursday":thursday_array, "Friday":friday_array};
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
            this.availability = new Availability(
                {
                               // 06:00, 07:00, 08:00, 09:00, 10:00, 11:00, 12:00, 13:00, 14:00, 15:00, 16:00, 17:00
                    "Monday":    [false, false, false, false, false, false, false, false, false, false, false, false],
                    "Tuesday":   [false, false, false, false, false, false, false, false, false, false, false, false],
                    "Wednesday": [false, false, false, false, false, false, false, false, false, false, false, false],
                    "Thursday":  [false, false, false, false, false, false, false, false, false, false, false, false],
                    "Friday":    [false, false, false, false, false, false, false, false, false, false, false, false]
                });
        }
        this.first = first;
        this.last = last;
    }
}

function database_to_id_object(id)
{
    return new ObjectId(id);
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
    const database = client.db(db_name);
    const collection = database.collection(type);

    var data;

    data = (query === undefined) ?
        await collection.find().toArray() : await collection.findOne(query);

    return data;
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
async function database_login(email)
{
    const database = client.db('scheduler');
    const collection = database.collection('login');

    login = await collection.findOne(email); 
    console.log('login:', login);

    return login;
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
async function database_get_multiple(type, query)
{
    const database = client.db(db_name);
    const collection = database.collection(type);

    var data;

    data = (query === undefined) ?
        await collection.find().toArray() : await collection.find(query).toArray();

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

    const database = client.db(db_name);
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

    const database = client.db(db_name);
    const collection = database.collection("faculty");

    const document =
    {
        email: faculty.email,
        availability:
        {
            "Monday": faculty.availability.monday,
            "Tuesday":faculty.availability.tuesday,
            "Wednesday": faculty.availability.wednesday,
            "Thursday": faculty.availability.thursday,
            "Friday": faculty.availability.friday
        },
        facultyFirst: faculty.first,
        facultyLast: faculty.last,
    };

    const result = await collection.insertOne(document);

    console.log(`A document was inserted with the _id: ${result.insertedId}`);

    return result.insertedId;
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
    const database = client.db(db_name);
    const collection = database.collection(type);

    console.log("new_value:", new_value);

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

    const database = client.db(db_name);
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
    Faculty_Entry,
    num_to_bool,
    database_to_id_object,
    database_get,
    database_login,
    database_get_multiple,
    database_add_request,
    database_add_faculty,
    database_update_entry,
    database_delete_entry
}
