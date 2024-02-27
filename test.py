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

#insertion operations
#collection.insert_one(post)
#collection.insert_many(inserts)

for post in collection.find(): #this will be used to query the database
    pprint(post)
#pprint(collection.find_one({"firstName" : "Brandon"}))

file = open("inbox.txt", "r")
body = file.read() 
file.close()

print(body)

#update operations
collection.update_one({"firstName" : "Jared", "availability.day": "Monday"}, 
                      {"$set": {"availability.$.times.start" : body}})
#collection.update_many()
#collection.replace_one() //replaces the doc

#delete operations
# collection.delete_one({"firstName" : "Brandon"})
# collection.delete_many({}) // deletes all documents