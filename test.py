from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from pprint import pprint

uri = "mongodb+srv://SkedUACS:d5eZne7eaXoKVavA@skedcluster.rr2li5f.mongodb.net/?retryWrites=true&w=majority"

# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'))

# Send a ping to confirm a successful connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)

print(client.list_database_names())

db = client.get_database('test-data')
print(db.list_collection_names())

collection = db.get_collection('test-collection')

post = {"firstName" : "Brandon",
        "lastName" : "Nguyen",
        "email" : "bhnguyen1@crimson.ua.edu",
        "number": 21}
collection.insert_one(post)
#collection.insert_many(inserts)

for post in collection.find(): #this will be used to query the database
    pprint(post)
#pprint(collection.find_one({"firstName" : "Brandon"}))

collection.update_one({"firstName" : "Jared"}, {"$set": {"number" : 22}})
#collection.update_many()
#collection.replace_one() //replaces the doc

# collection.delete_one({"firstName" : "Brandon"})
# x = collection.delete_many({}) // deletes all documents
# print(x.deleted_count, " documents deleted.")