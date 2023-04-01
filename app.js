const express = require("express")
const app = express()
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
require("dotenv").config()
const router = require("./api")
//app.use(express.json());


// parse application/json

app.use ("/api", router)

// Setup your Middleware and API Router here

module.exports = app;
//setup routing - index.js in api shoots to dif folders for url - i.e. point to index.js file in api folder
// /api pointing to index.js folder
//app.use 
//create route in a routes file - add app.use to route file