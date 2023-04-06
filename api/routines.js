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

router.post('/', requireUser, async (req, res, next) => {
    const { isPublic, name, goal } = req.body;
    const creatorId = req.user.id //we want to grab userId to verify user is logged in
    // only send the tags if there are some to send
    try {
        if (creatorId && isPublic, name, goal) {
            const newRoutine = createRoutine({creatorId, isPublic, name, goal});
            res.send (newRoutine)
        console.log("newRoutine", newRoutine)
  } else {
      next({
          name: "Create routines error",
          message: "Error with creating new routine-missing input"
      })
  }
      
    } catch ({ name, message }) {
      next({ name, message });
    }
  });

// PATCH /api/routines/:routineId

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
