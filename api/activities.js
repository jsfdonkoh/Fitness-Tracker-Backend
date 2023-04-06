const { ActivityExistsError, ActivityNotFoundError } = require("../errors");
const express = require('express');
const router = express.Router();
const { requireUser } = require("./utilities");
const {getAllActivities,
    getActivityById,
    getActivityByName,
    attachActivitiesToRoutines,
    createActivity,
    updateActivity,
    getPublicRoutinesByActivity,
  } = require("../db")
// GET /api/activities/:activityId/routines
router.get('/:activityId/routines', async (req, res, next) => {
    
  try {
    const activity =req.params;
    //want to use activity to pass in for getPublicRoutinesByActivity function but don't know how to identify it by Id - do we need to identify it by Id?
    //const id = //SOMETHING NEEDS TO GO HERE      
        
    const routines = await getPublicRoutinesByActivity(activity);
    if (routines.length === 0)                  
    res.send ({
        message: `Activity ${id} not found`,
        name: "activity doesn't exist",
    })
      res.send(routines);
      // send out an object to the client { posts: // the posts }
    } catch ({ name, message }) {
        next({ name, message });
      // forward the name and message to the error handler
    }
  });

// GET /api/activities

router.get('/', async (req, res) => {
    try {
 
     const activities = await getAllActivities();
    if (!activities) {
        res.send({ message: "There are no activities" });
    } else { 
        res.send(
       activities
     );
    }
     console.log("Activities2", activities)
    // } catch ({ name, message }) {
    //     next({ name, message });
    } catch (error){
    console.log("Error getting activities")
    }
 
 });

// POST /api/activities*
router.post('/', requireUser, async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const { name, description } = req.body;
    try {
        const token = authHeader.split(" ")[1];
        // const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // const username = decoded.username;
        const activityName = await getActivityByName(name);
        
        //console.log("activityName3", activityName)
        if (activityName) {
                res.send({
                    name: 'NotFound',
                    message: `An activity with name ${name} already exists`
                  });
        } else {
            const activity = await createActivity({name, description});
            res.send (activity)
        }
    } catch ({ name, message }) {
        next({ name, message });
    }

})

// PATCH /api/activities/:activityId*

router.patch('/:activityId', requireUser, async (req, res, next) => {
    const { activityId } = req.params;
    const { name, description} = req.body;
  
    const updateFields = {};
  
    if (name) {
      updateFields.name = name;
    }
  
    if (description) {
      updateFields.description = description;
    }
  
    try {
      
      if (user) {
        const updatedActivity = await updateActivity(activityId, updateFields);
        res.send({ activity: updatedActivity })
      } else {
        next({
          name: 'User not logged in',
          message: 'Must be logged to update activity'
        })
      }
    } catch ({ name, message }) {
      next({ name, message });
    }
  });


module.exports = router;
