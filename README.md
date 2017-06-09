# AuthenticationReduxTest with Koa1
This is a test project which helped me to learn React, Redux, Express and JWT authentication method

## Serverside
The server side is written with Koa 1 using generators and promises in order to avoid callbacks. The database is postgresSQL and the orm used for inserting and retrieving users is Sequelize

## Running the serverside
In order to be able to run it, first you have to create a new "user" database (or call it however you want), but you must change the URL connection string you can find in /confi/default.js file

## Starting the projects
After installing all the packages, both projects (the client side and the server side) have to be started by running *npm run start* command.
