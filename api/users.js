/* eslint-disable no-useless-catch */
const express = require("express");
const usersRouter = express.Router();
//const usersRouter = require("/Users/zacharywilliams/UNIV_FitnessTrackr_Starter/api/users.js");
const bcrypt = require('bcrypt');
//jwt pulled from juicebox
const jwt = require('jsonwebtoken');
const {getPublicRoutinesByUser} = require ('../db/routines');
const { 
    getAllUsers, 
    getUserByUsername, 
    createUser 
} = require('../db/users');
//const { request } = require("../app");
require('dotenv').config();
//reference jwt_secret here
const JWT_SECRET = "neverTell"
usersRouter.use((req, res, next) => {
    console.log("A request is being made to /users");
  
    next();
  });
// POST /api/users/register
//pulled in this from Juicebox API Register


usersRouter.post('/register', async (req, res, next) => {
    const { username, password } = req.body;
    try {
    const _user = await getUserByUsername(username);
    console.log("user7", _user)
    //hash password is happening in db, doesn't need to be here
    //const SALT_COUNT = 10;
    //const hashedPassword = await bcrypt.hash(password, SALT_COUNT)
    //send a status below - res.status status code for errors (401 code = unauth error code)
      if (_user) {
        res.send({
            error: 'error',
            message: `User ${username} is already taken.`,
            name: 'error'
        });
    
    //     next({
    //       name: 'UserExistsError',
    //       message: 'A user by that username already exists'
    //  });
      } else if(password.length < 8){
        next({
            password: "Password must be 8 characters"
        });
      } else {
        const user = await createUser({
        username, password
    });
    const token = jwt.sign({ 
        id: user.id, 
        username
      },JWT_SECRET, {
        expiresIn: '1w'
      });
  
      res.send({ 
        message: "thank you for signing up",
        token, 
        user
      });
}
    
    //pass in username and password below (not hashed) 
    //   const user = await createUser({
    //     username, password
    //   });
    //check password before mess w/ db ln 35-38 to ln 28
    //once we create user check if not user, return message that account was not created 
    //save password, get token w/ jwt sign - will get token - res.send 
      
    } catch ({ name, message }) {
      next({ name, message })
    } 
  });

// POST /api/users/login
usersRouter.post('/login', async (req, res, next) => {
    console.log("Username & password", req.body);
    const username = null;
    const password  = null;
    //request must have both
    if (!username || !password) {
      next({
        name: "MissingCredentialsError",
        message: "Please supply both a username and password"
      });
    }

try {
    const user = await getUserByUsername(username, password);
    const SALT_COUNT = 10;
    const hashedPassword = await bcrypt.hash(password, SALT_COUNT)

console.log("Password comparisons", hashedPassword, password);
    if (user && bcrypt.compare (hashedPassword, password)) {
      const token = jwt.sign({id: user.id, username: username}, process.env.JWT_SECRET);
      res.send({ message: "you're logged in!", token});
    } else {
      next({
        name: 'IncorrectCredentialsError',
        message: 'Username or password is incorrect'
      });
    }
  } catch(error) {
    console.log(error);
    next(error);
  }
});

// GET /api/users/me

usersRouter.get('/users', async (req, res, next) => {
    const { username } = req.params;
    try {
     const token = jwt.sign({username}, process.env.JWT_SECRET);
     const activeUser = await getAllUsers({token, username});
     if (!token) {
        next ({
            message:"Invalid credentials"
        })
     } 
     res.send({
       activeUser
     });
    } catch (error){
     console.log(error)
    }
 
 });

// GET /api/users/:username/routines

usersRouter.get('/:username/routines', async (req, res, next) => {
   const { username } = req.params;
    try {
 
     const userRoutines = await getPublicRoutinesByUser(username);
    if (!username){
        next({
            message:"No public routines for this user"
        })
    }
     res.send({
       userRoutines
     });
    } catch (error){
     console.log(error)
    }
 
 });
module.exports = usersRouter;
