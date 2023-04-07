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
	const { activityId } = req.params;
	const id = parseInt(activityId);
	const existsId = await getActivityById(activityId)

	try {
		const routinesByActivity = await getPublicRoutinesByActivity({ id });

		if (!existsId) {
			res.send({ 
				error: "No activity",
				message: `Activity ${activityId} not found`,
				name: "Error"
			});
		}

		if (routinesByActivity.length > 0) {
			res.send(routinesByActivity);
		} else {
			res.send({ message: 'No matching routines found' });
		}
	} catch ({ name, message }) {
		next({ name, message });
	}
});

// router.get('/:activityId/routines', async (req, res, next) => {
    
//   try {
//     const activity =req.params;
      
        
//     const routines = await getPublicRoutinesByActivity(activity);
//     if (routines.length === 0)                  
//     res.send ({
//         message: `Activity ${id} not found`,
//         name: "activity doesn't exist",
//     })
//       res.send(routines);
      
//     } catch ({ name, message }) {
//         next({ name, message });
      
//     }
//   });

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
                    error: "Duplicate activity name",
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


router.patch('/:activityId', async (req, res, next) => {
  
  try {
  const { activityId } = req.params;
  const { name, description } = req.body;

  const updateFields = {};

  if (name) {
    const existingActivity = await getActivityByName(name);
    if (existingActivity) {
      
      res.send({
        error:"activity already exists",
        name: 'Activity name already exists',
        message: `An activity with name ${name} already exists`
      });
    }
    updateFields.name = name;
  }

  if (description) {
    updateFields.description = description;
  }
    const activity = await getActivityById(activityId);
console.log("activityId4", activityId)
    if (!activity) {
      res.send({
        error:"Activity does not exist",
        name: 'Activity not found',
        message: `Activity ${activityId} not found`
      });
    }

    const updatedActivity = await updateActivity({name, description, id: activityId});
    res.send({ id: +activityId, description, name })
  } catch ({ name, message }) {
    next({ name, message });
  }
});




// router.patch('/:activityId', async (req, res, next) => {
//     const { activityId } = req.params;
//     const { name, description} = req.body;
  
//     const updateFields = {};
  
//     if (name) {
//       updateFields.name = name;
//     }
  
//     if (description) {
//       updateFields.description = description;
//     }
  
//     try {
      
//       if (user) {
//         const updatedActivity = await updateActivity(activityId, updateFields);
//         res.send({ activity: updatedActivity })
//       } else {
//         next({
//           name: 'User not logged in',
//           message: 'Must be logged to update activity'
//         })
//       }
//     } catch ({ name, message }) {
//       next({ name, message });
//     }
//   });


module.exports = router;
