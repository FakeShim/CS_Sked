db.requests.drop();
db.requests.insertMany(
    [
      {
        "date":"05/06/2024",
        "email":"mmay@crimson.ua.edu",
        "facultyFirst":"Maclane",
        "facultyLast":"May",
        "status":"Pending",
        "studentFirst":"Peter",
        "studentLast":"Shim",
        "req":{"3/16":[8, 9, 10],
               "3/17":[8, 9, 11],
               "3/18":[9, 13, 14],
              }
      },
      {
        "date":"05/06/2024",
        "email":"mmay@crimson.ua.edu",
        "facultyFirst":"Maclane",
        "facultyLast":"May",
        "status":"Pending",
        "studentFirst":"Peter",
        "studentLast":"Shim",
        "req":{"4/3":[8, 12, 16]}
      },
      {
        "date":"05/10/2024",
        "email":"manderson@crimson.ua.edu",
        "facultyFirst":"Monica",
        "facultyLast":"Anderson",
        "status":"Accepted",
        "studentFirst":"David",
        "studentLast":"Dillard",
        "req":{"3/27":[8, 11, 14]}
      }
    ]
)