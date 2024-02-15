#look into using mongo atlas instead of local mongo
# from this website: https://pymongo.readthedocs.io/en/stable/tutorial.html
#make sure to install fast api

import pprint
from pymongo import MongoClient
#for web applications
from bson.objectid import ObjectId

client = MongoClient('localhost', 27017)

print(client.list_database_names())  

db = client['test-database']

collection = db['test-collection']

post = {"firstName" : "Brandon",
        "lastName" : "Nguyen",
        "email" : "bhnguyen1@crimson.ua.edu",
        "age" : 21 }
# inserts = [ {}, {}, {}]

#create operations
collection.insert_one(post) #creates or insert a document into the collection
id = post["_id"] #id of the document
print(id)

#collection.insert_many(inserts)
    
#find operations
pprint.pprint(collection.find_one()) #finds a single document (usually the first) that matches the query
#pprint.pprint(collection.find_one({"firstName" : "Brandon"})) #finds the first document that matches the query

'''
for post in collection.find():
    pprint.pprint(post) 
'''

#update operations
collection.update_one({"firstName" : "Brandon"}, {"$set": {"age" : 22}}) #updates the first document that matches the query
pprint.pprint(collection.find_one({"firstName" : "Brandon"}))

#collection.update_many()
#collection.replace_one() //replaces the doc

#delete operations
x = collection.delete_many({})
print(x.deleted_count, " documents deleted.")

#delete_one()


