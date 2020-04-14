# Connected-Networks-Project


# Database Connection
Credentials for the database are stored in a file named ".env" on the same level as all the Controller files.
The ".env" file should contain 5 lines:
DATABASE = {Database name}
HOST = {Host name}
USER = {Username in the database system}
PASSWORD = {Password for the user in the database}
BLUEBIRD_W_FORGOTTEN_RETURN = 0 (suppresses a warning related to promise syntax)
  
# Changing Databases
To change to a new MySQL database, first configure the database by dropping all tables and then running the "SQLTableOverHaulConstruction" file on the database.
Important: Make sure before configuring the database that the database does not have a table or view named "Session"
After configuring the database, modify the .env file with credentials to the new database.
The Passport module used in the Connected Networks software will add a Session table to the database once a user has logged in.

# Transfering Databases
To migrate to a new database while maintaining data, it is necessary and sufficient to transfer over the data in the tables named:
User
Funds
SharedFunds
Individuals
Companies
OriginalFundPosition
EmployeeHistory
