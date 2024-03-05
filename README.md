# CS_Sked
UA CS Department Scheduling app

Sprint 1: To run the code on the repository, first run:

`python flaskapp.py` or `python3 flaskapp.py`

It will return a link to `https://127.0.0.1:5000`. You must click this link to 
begin Outlook authorization. 

This will collect the latest email in the inbox. To properly use the database
script, send an email to your outlook inbox containing a single time 
(Format \#\#:\#\#). After this email is received, refresh the localhost page, 
and it will read in that number. Then, run the test.py script using the following:

`python test.py` or `python3 test.py`

This will write the time to the database.

DISCLAIMER: This code is very experimental and as a result will change heavily 
in the next sprint. This "tutorial" will then be removed. Also, access to the 
database is private, so other users won't be able to check the updated database. 
This will be resolved in an upcoming sprint.

Sprint 2:

This project is composed of a React frontend and a Django backend. The entire
environment is dockerized. To run the project and load the webapp use the
following commands at the project root level:

`docker-compose build` then `docker-compose run`
