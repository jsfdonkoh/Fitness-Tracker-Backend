/* eslint-disable no-useless-catch */
const express = require("express");
const router = express.Router();
const usersRouter = require("/Users/zacharywilliams/UNIV_FitnessTrackr_Starter/api/users.js");
const bcrypt = require('bcrypt');
//jwt pulled from juicebox
const jwt = require('jsonwebtoken');
const { 
    //getAllUsers, 
    getUserByUsername, 
    createUser 
} = require('../db');
// POST /api/users/register
//pulled in this from Juicebox API Register
usersRouter.post('/register', async (req, res, next) => {
    const { username, password } = req.body;
    try {
    const _user = await getUserByUsername(username);
    const SALT_COUNT = 10;
    const hashedPassword = await bcrypt.hash(password, SALT_COUNT)
      if (_user) {
        next({
          name: 'UserExistsError',
          message: 'A user by that username already exists'
        });
      }
  
      const user = await createUser({
        username,
        hashedPassword,
      });
  
      if (password.length < 8){
        next({
            password: "Password must be 8 characters"
        });
      }
      //are we using this token?
      const token = jwt.sign({ 
        id: user.id, 
        username
      }, process.env.JWT_SECRET, {
        expiresIn: '1w'
      });
  
      res.send({ 
        message: "thank you for signing up",
        token 
      });
    } catch ({ name, message }) {
      next({ name, message })
    } 
  });

// POST /api/users/login
usersRouter.post('/login', async (req, res, next) => {
    const { username, password } = req.body;
    // request must have both
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

    if (user && user.password == hashedPassword) {
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

usersRouter.get('/', async (req, res) => {
    try {
 
     const users = await getAllUsers();
 
     res.send({
       users
     });
    } catch (error){
     console.log(error)
    }
 
 });

// GET /api/users/:username/routines

usersRouter.get('/', async (req, res) => {
    try {
 
     const users = await getAllUsers();
 
     res.send({
       users
     });
    } catch (error){
     console.log(error)
    }
 
 });
module.exports = router;
