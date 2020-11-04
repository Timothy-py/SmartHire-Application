# SmartHire-API

This is a simple Skill and Goal Review Manangement solution.

# SETUP

- Clone the project into your local machine
- Install sequelize cli if you don't have already on your local machine
- Setup postgresql client on your local machine
- Use the variables in config/config.json to create a database or make changes and setup yours accordingly
- Run the database migration with sequelize cli.

### NOTE: The migrations should be done in two batches.

    + First, remove from the migrations folder the two files that involves association, then the
    + Second migration, included the two files and run another migration.

- NPM install the modules
- Start the application server with - npm start
- Go through from the server.js file to the routes folder to access the routes apis.
