# Project Title

Northcoders-News

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

## Installing

1.  Fork this repo to your own gitHub account
2.  Clone this repo to your machine (run `git clone (url of your fork)` in your terminal
3.  install prerequistites - see below
4.  set up config files - see config section below
5.  to test installation, open two terminal windows. in the first, run `mongod` in the second, run `npm seed:dev`. This will seed your dev database. 

## Prerequisites

1. install mongodb - instructions can be found here https://docs.mongodb.com/manual/installation/ 
(make sure you follow the right set for your OS)
2. Run `npm i` in the terminal
3. this app runs on node v8.10.0 and mongodb v3.6.3. other versions may work but are not supported 

## Config

in order for this file to run, a config file is required. 
The links to the database within Mongodb are stored within. 
The code is set to default to the Dev enviroment, if no enviroment is declared on the process object under - process.env.NODE_ENV. This should be done in an index file like so

`const path = process.env.NODE_ENV || "dev";`

`module.exports = require(`./${path}DB`);`

then each database url, as well as the port express will use to listen. This should be stored in a {enviroment}DB.js on an object. and directly exported in the following format. In the example below, I have used port 9090, as that is the port I reserve for express, but you can use any free port. 

`module.exports = {`
  
  `DB_URL: 'mongodb://localhost:27017/database-title',`
  `PORT: 9090`

};

## Running the tests

tests can be run by running `npm t` in your terminal

Tests confirm that all routes function properly, as well as testing error-handling middleware for client-side errors.

If you wish to look at a model for how it should work within a browser, check out the version hosted on Heroku at https://northcoders-news-production.herokuapp.com/. The database is hosted seperately on Mlab.

to use non-GET routes, consider installing postman from https://www.getpostman.com/

## Built With

Mongodb

Node

VScode

## Author

Luke Birkett

### Acknowledgments

All thanks to Northcoders, both the organisation,
and specifically Cohort 14,
without whom I wouldn't be half the coder I am.
