// api/utilities.js

function requireUser(req, res, next) {
  console.log("req.user1", req.user)
    if (!req.user) {
      console.log("trex")
      res.status(401)
      next({
        name: "MissingUserError",
        message: "You must be logged in to perform this action"
      });
    }
  
    next();
  }
  
  module.exports = {
    requireUser
  }