# Connected-Networks-Project

## Set up

### Required Tools

- [NodeJS](https://nodejs.org/en/)

### Recommended Tools

- [MySQL workbench](https://www.mysql.com/products/workbench/)
- [React Dev Tools](https://reactjs.org/blog/2019/08/15/new-react-devtools.html)
- ts-node installed globally (`npm install -g ts-node`)

### Database

#### Installing MySQL

1. Get [MySQL installer](https://www.mysql.com/products/workbench/).
2. Run the Installer. Select MySQL workbench and MySQL Server.
3. For the MySQL Server, use the Old Authentication method.
4. For setting up Users:
   1. `Username: Root`
   2. `Host: LocalHost`
   3. `Password: [Create a password of your choice]`
5. Go to “MySQL Command Line Client”:
   1. CREATE DATABASE [databaseName]
   2. USE [databaseName]
6. MySQL workbench is now using your selected database.

#### Setting Up the Database

1. Open MySQL workbench and sign into the MySQL database you just created.
2. Open and Run the SQLTableOverhaulConstruction.sql file. This will construct the tables for the Database.
3. To view the contents of the tables, open and run the SelectAllOverhaulTables.sql file.
4. To drop all tables, run the DropOverhaulTables.sql file.

### Backend

Ensure that the following files are all in the same folder:

- `AuthController.ts`
- `CompaniesController.ts`
- `FundsController.ts`
- `HistoryController.ts`
- `NotificationController.ts`
- `ParsingController.ts`
- `PeopleController.ts`
- `UpdatesController.ts`
- `UsersController.ts`
- `server.ts`
- `router.ts`
- `package-lock.json`
- `package.json`

### Deployment

Given that the project consists of two smaller projects for the backend (`root` folder) and the frontend (`client` folder). Two building scripts should be called for the project to be built.

#### To build the backend

`npm install`

#### To build the frontend

`cd client && npm install && npm run build`

#### To run

`cd .. && npm start`

#### For the sake of simplicity, we provided a script to run all the above scripts

`npm deploy`

Please note that most deployment services will automatically run npm install and npm start, as a result we recommend to make sure of what scripts will be run by the service first.

### Running The Project Locally

Before running the project make sure to build the backend and frontend first (See Deployment)

#### To run the backend

`npm start`

#### To run the frontend

`cd client && npm start`

### Testing

#### To run all tests:

`npm run test`

#### To run all tests + show the coverage:

`npm run test:coverage`

To see the coverage report, go to `./coverage/Icov-report` and open `index.html` in your browser of choosing.

## Documentation

### Database

#### SQL Database

The SQL Database can be accessed using MySQL Workbench (See Setup). With the database selected, as mentioned in the setup instructions, you can create and use SQL files to modify the database at your discretion.

#### Sequelize Functions

##### Connecting to the MySQL Database

In order to connect to a MySQL Database, you will need to create a new instance of Sequelize with the Database Name, the username you used when entering with MySQL Workbench, the password that matches that account, and the host name that corresponds with the database. Your new instance of Sequelize will also need to specify the dialect to be `mysql`. As it is currently set up, you can change these fields directly by modifying the corresponding field in the `.env` file:

```javascript
const sequelize = new Sequelize(process.env.DATABASE, process.env.USER, process.env.PASSWORD, {
  host: process.env.HOST,
  dialect: "mysql",
  define: {
    freezeTableName: true,
  },
  logging: false,
});
```

The `freezeTableName` option is used to prevent Sequelize from attempting to rename your table models to a pluralized form. (It does this when the program is running, so it wouldn’t be a visible change like autocorrect.) The `logging` option is optional here, though disabling it makes it easier to debug as it doesn’t flood the console.

If you are having trouble running sequelize, you may need to use npm to install a version of mysql. (This was the use of the aforementioned dialect).

Using the sequelize object you constructed, you can connect to the database by using sequelize.connect and a corresponding `sequelize.authenticate()` function as shown:

```javascript
sequelize.connect = function () {
  sequelize
    .authenticate()
    .then(() => {
      console.log("Connection has been established successfully.");
    })
    .catch((err) => {
      console.error("Unable to connect to the database:", err);
    });
};
```

With this, running the file will connect to the database. (It will eventually time out if nothing is done with it.)

##### Modeling the Tables
All the tables in the database have a corresponding model constructed in the `modelSetup.js` file. It is important to note that Sequelize is not a replacement for the MySQL Database; it is more akin to a mirror to it. You cannot construct a new model in Sequelize and use it without having manually made a corresponding MySQL table in your Database. 

All fields in a Model must correspond to the same fields as the Table being modeled from the MySQL Database. You must also specify the type, if a `null` value is allowed, if it is a primary key, and if it autoincrements. If there is a foreign key, you will use the “references” field. (You would specify the Model of the Foreign Key and the Field of that model’s primary key). You should also set `timestamps` to false, or Sequelize will behave as though you created a table with two extra fields.

To connect Foriegn keys, use `HasForeignKey.belongsTo(HasPrimaryKey)` and `HasPrimaryKey.hasMany(HasForeignKey)`. (Please note that these are not exact. For exact coding, please refer to the code or sequelize.org. 

##### Creating Sequelize Functions
To access the models (if they are in a different file), use the `require` function, like you would for any other module (but use the relative pathname). The functions located in sequelFunctions.js are primarily built off of each other, using functions that create, remove, or modify instances from the Tables in the MySQL Database. The use of promises allows you to use the results of newly created instances, which can be chained together for more useful functions. A full list can be found at sequelize.org. The primary method to access/use these functions is to call `[nameOfRequiredFile].[NameOfModel].[SequelizeFunctionName]`.

### Backend

#### server/router

Router.ts dictates to server.ts how to distribute most API calls. Most API calls are sent to the relevant controller class.
Future API endpoints that don’t match any of the existing cases in router.ts may require adding lines to router.ts.

#### Controllers

The controller classes process calls to relevant API endpoints. These classes have functions to handle API calls and helper functions called by other functions.
API handling functions should check req.user.UserID for the id of the user and only change/retrieve data relevant to that user.
Most functions will refer to `./sequelizeDatabase/sequelFunctions` to call database functionality.

#### Backend Security

Passport (under `./config`) handles login and logout functionality and password hashing.
All API calls that retrieve specific data should check that the provided userID is authorized to view the specified data.

### Frontend

#### Client Folder

All of the frontend code is inside the `client` Folder

#### Src Folder

##### App.tsx

The main class of the frontend, where it starts running.

##### Pages

All the pages can found in src folder which includes:

- `LoginPage.tsx`
- `SignupPage.tsx`
- `MainPage.tsx`

##### Components Folder

Components folder contains all smaller components that includes all the tables, inputs, buttons and everything else that can be included in pages.
