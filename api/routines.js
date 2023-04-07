const express = require('express');
const router = express.Router();
const { requireUser } = require("./utilities");
const { getRoutineById,
  getRoutinesWithoutActivities,
  getAllRoutines,
  getAllPublicRoutines,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
  getPublicRoutinesByActivity,
  createRoutine,
  updateRoutine,
  destroyRoutine } = require('../db');
const usersRouter = require('./users');

// GET /api/routines

router.get("/", async (req, res) => {
    const allRoutines = await getAllPublicRoutines();
    res.send(allRoutines)
})

// POST /api/routines*

router.post('/', async (req, res, next) => {
    if (!req.user) {
        console.log("trex")
        res.status(401)
        res.send({
            error: "trex",
          name: "MissingUserError",
          message: "You must be logged in to perform this action"
        });
        next()
      } else {

    console.log("req.user11", req.user)
    const { isPublic, name, goal } = req.body;
   
    const creatorId = req.user.id //we want to grab userId to verify user is logged in
    // only send the tags if there are some to send
    try {
        
        if (!req.user.id) {
            res.send({error:"something", message:'You must be logged in to perform this action', name:"something"})
            }
        const newRoutine = await createRoutine({creatorId, isPublic, name, goal});
        if (newRoutine) {
            
            console.log("newRoutine1", newRoutine)
            res.send (newRoutine)
        console.log("newRoutine", newRoutine)
  } else {
      res.send({
          name: "Create routines error",
          message: "Error with creating new routine-missing input"
      })
  }
      
    } catch (error) {
      next({error:"something", message:'You must be logged in to perform this action', name:"something"});
    }
}
  });

// PATCH /api/routines/:routineId

router.patch('/:routineId', async (req, res, next) => {
  const { routineId } = req.params;
  const { isPublic, name, goal } = req.body;
 const authHeader = req.headers.authorization
    if (!authHeader) {
      res.send({
        error: "Authenticated error",
        message:"You must be logged in to perform this action",
        name: "name error"
      })
    }
  try {
    const routine = await getRoutineById(routineId);
    const token = authHeader.split(" ")[1]
    const loggedInUser = jwt.verify(token, JWT_SECRET)
    if (routine.creatorId !== loggedInUser.id) {
      return res.status(403).send({
        error: 'sdfgsdg',
        message: `User ${loggedInUser.username} is not allowed to update ${routine.name}`,
        name: 'dfgdsfg',
      });
    }
    const updatedRoutine = await updateRoutine({
      id: routineId,
      isPublic,
      name,
      goal
    });
    res.send(updatedRoutine);
  } catch (error) {
    next(error);
  }
});

//ORIGINAL 
// router.patch('/:routineId', async (req, res, next) => {
//     const { routineId } = req.params;
//     const { isPublic, name, goal } = req.body;
//     const creatorId = req.user.id;
//     const authHeader = req.headers.authorization;

//     try {
//       if (!authHeader) {
//         res.send({error: "you must be logged in to use this action"})
//       }
      
//       const routine = await getRoutineById(routineId);
//       if (routine.creatorId !== creatorId) {
//         return res.status(403).send({
//           error: 'User is not the creator of this routine',
//         });
//       }
  
//       const updateFields = {
//         isPublic: isPublic,
//         name: name,
//         goal: goal,
//       };
     
//       const updatedRoutine = await updateRoutine(routineId, updateFields);
//       res.send(updatedRoutine);
//     } catch (error) {
//       next(error);
//     }
//   });
  


// DELETE /api/routines/:routineId
router.delete('/:routineId', requireUser, async (req, res, next ) => {
    const authHeader = req.headers.authorization;
    const id = req.params.routineId;
    try {
        const token = authHeader.split(" ")[1];
        const currentUser = req.params.username;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const username = decoded.username;
        // const routine = await destroyRoutine(id);
       //if statement that compares current user with creatorId - if !user = creatorId 
       const routine = await getRoutineById(id);
       if (routine.creatorId !=currentUser) {
        res.send(403);
        next ({
            message:  `User ${username} is not allowed to delete ${routine.name}`,
            name: "Unauthorized user"
        })
       } else {
        await destroyRoutine(routine.id)
        res.send(routine)
       }
    } catch ({ name, message}) {
        next({name, message});
    }
})
// POST /api/routines/:routineId/activities

module.exports = router;
