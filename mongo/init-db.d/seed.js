db.faculty.drop();
db.faculty.insertOne(
    {
        "email":"bhngyen3@crimson.ua.edu",
        "availability":{
            "monday":[true,false,true,false,true,false,true,false,true,false,true,false],
            "tuesday":[true,false,true,false,true,false,true,false,true,false,true,false],
            "wednesday":[true,false,true,false,true,false,true,false,true,false,true,false],
            "thursday":[true,false,true,false,true,false,true,false,true,false,true,false],
            "friday":[true,false,true,false,true,false,true,false,true,false,true,false]},
        "facultyFirst":"Brandon",
        "facultyLast":"Nguyen"
    }
)

db.requests.drop();
db.requests.insertMany(
    {
        "_id":{"$oid":"66215bee946e5fc4dfc95416"},
        "date":"05/06/2024",
        "email":"mmay@crimson.ua.edu",
        "facultyFirst":"Maclane",
        "facultyLast":"May",
        "status":"Pending",
        "studentFirst":"Peter",
        "studentLast":"Shim",
        "req":{"3/16":[{"$numberInt":"8"},{"$numberInt":"9"},{"$numberInt":"10"}]}
      },
      {
        "_id":{"$oid":"66215c43946e5fc4dfc95417"},
        "date":"05/06/2024",
        "email":"mmay@crimson.ua.edu",
        "facultyFirst":"Maclane",
        "facultyLast":"May",
        "status":"Pending",
        "studentFirst":"Peter",
        "studentLast":"Shim",
        "req":{"4/3":[{"$numberInt":"8"},{"$numberInt":"12"},{"$numberInt":"16"}]}
      },
      {
        "_id":{"$oid":"66215ccf946e5fc4dfc95418"},
        "date":"05/10/2024",
        "email":"manderson@crimson.ua.edu",
        "facultyFirst":"Monica",
        "facultyLast":"Anderson",
        "status":"Accepted",
        "studentFirst":"David",
        "studentLast":"Dillard",
        "req":{"3/27":[{"$numberInt":"8"},{"$numberInt":"11"},{"$numberInt":"14"}]}
      }
)