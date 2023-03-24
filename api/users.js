/* eslint-disable no-useless-catch */
const express = require("express");
const router = express.Router();

// POST /api/users/register
//pulled in this from Juicebox API Register
userRouter.post('/register', async (req, res, next) => {
    const { username, password } = req.body;
  
    try {
      const _user = await getUserByUsername(username);
  
      if (_user) {
        next({
          name: 'UserExistsError',
          message: 'A user by that username already exists'
        });
      }
  
      const user = await createUser({
        username,
        password,
      });
  
      if (password.length <8){
        next({
            password: "Password must be 8 characters"
        })
      }
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

// GET /api/users/me

// GET /api/users/:username/routines

module.exports = router;
