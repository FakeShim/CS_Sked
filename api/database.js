const process = require('process')
const { MongoClient } = require('mongodb');

yourConnectionURI = "mongodb+srv://" + process.env.DB_USERNAME + ":" + process.env.DB_PASSWORD + "@skedcluster.rr2li5f.mongodb.net/?retryWrites=true&w=majority"

const client = new MongoClient(yourConnectionURI);

async function database_get(type, first_name, last_name, )
{
    await client.connect();
    console.log("connected");

    const database = client.db("test-data");
    const test = database.collection("test-collection");

    const query = { firstName: "Jared" };

    
    const student = await test.findOne(query);

    console.log(student);

    await client.close();
}

module.exports = { database_get } 
