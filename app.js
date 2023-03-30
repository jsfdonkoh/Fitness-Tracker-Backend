require("dotenv").config()
const express = require("express")
const app = express()
const router = require("./api")
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use ("/api", router)

// Setup your Middleware and API Router here

module.exports = app;
//setup routing - index.js in api shoots to dif folders for url - i.e. point to index.js file in api folder
// /api pointing to index.js folder
//app.use 
//create route in a routes file - add app.use to route file