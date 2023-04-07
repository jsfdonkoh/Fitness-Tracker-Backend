// api/utilities.js

function requireUser(req, res, next) {
  console.log("req.user1", req.user)
    if (!req.user) {
      console.log("trex")
      //switched from next to .send ; added error message
      res.status(401).send({
        error:"Authentication error",
        name: "MissingUserError",
        message: "You must be logged in to perform this action"
      });
    }
  
    next();
  }
  
  module.exports = {
    requireUser
  }