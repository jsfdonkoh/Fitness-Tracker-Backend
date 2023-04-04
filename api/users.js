/* eslint-disable no-useless-catch */
const express = require("express");
const usersRouter = express.Router();
//const usersRouter = require("/Users/zacharywilliams/UNIV_FitnessTrackr_Starter/api/users.js");
//const bcrypt = require('bcrypt');
//jwt pulled from juicebox
const jwt = require('jsonwebtoken');
const {getPublicRoutinesByUser} = require ('../db/routines');
const { 
    getUser,
    getUserByUsername, 
    createUser,
    getUserById 
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
        res.send({
            error: "Error",
            message: "Password Too Short!",
            name: "Name"
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
    const {username, password} = req.body
    
    // const username = null;
    // const password  = null;
    //request must have both
    if (!username || !password) {
      next({
        name: "MissingCredentialsError",
        message: "Please supply both a username and password"
      });
    }

try {
    const user = await getUser({username, password});
    const token = jwt.sign({ 
        id: user.id, 
        username
      },JWT_SECRET, {
        expiresIn: '1w'
      });
    
    if (!user) {
        next({
            name: 'IncorrectCredentialsError',
            message: 'Username or password is incorrect'
        });
    } else {
        res.send ({user, message: "you're logged in!", token});
    }

    // const user = await getUserByUsername(username, password);
    // const SALT_COUNT = 10;
    // const hashedPassword = await bcrypt.hash(password, SALT_COUNT)

//console.log("Password comparisons", hashedPassword, password);
    // if (user && bcrypt.compare (hashedPassword, password)) {
    //   const token = jwt.sign({id: user.id, username: username}, process.env.JWT_SECRET);
    //   res.send({ message: "you're logged in!", token});
    // } else {
    //   next({
    //     name: 'IncorrectCredentialsError',
    //     message: 'Username or password is incorrect'
    //   });
    // }

    
  } catch(error) {
    console.log(error);
    next(error);
  }
});

// GET /api/users/me

usersRouter.get("/me", async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).send({
        error: "401 - Unauthorized",
        message: "You must be logged in to perform this action",
        name: "UnauthorizedError",
      });
    }
  
    try {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id;
      const user = await getUserById(userId);
  
      if (!user) {
        res.status(404).send({
          name: "user not found error",
          message: "User not found.",
        });
      } else {
        res.send({
          id: user.id,
          username: user.username,
        });
      }
    } catch (error) {
      next(error);
    }
  });

// usersRouter.get('/me', async (req, res, next) => {
//     console.log("testtesttest")
//     const authHeader = req.headers.authorization
//     const token = authHeader.split(" ")[1]
//     try {
//      const decoded = jwt.verify(token, process.env.JWT_SECRET);
//      const userId = decoded.id
//      const user = await getUserById (userId)
//      console.log("token3", user)
//      if (user){
//         res.send({
//             id: user.id,
//             username: user.username
//           });
        
//         } else { 
        
//           res.status(401).send(
//             {
//             error:"401 / Unauthorized", 
//             name: "user not logged in error",
//             message: "User not Found."
//           });
//      } 

//     } catch ({name, message}){
//        next ({name, message})
     
//     }
//  });
    

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
