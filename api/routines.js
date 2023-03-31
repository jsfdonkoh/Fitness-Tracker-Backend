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
    const id = req.params.routineId;
    try {
        const routine = await destroyRoutine(id);
       //if statement that compares current user with creatorId - if !user = creatorId 
        res.send(403);
        next ({
            message:  `User ${user.username} is not allowed to delete ${routine.name}`,
            name: "Unauthorized user"
        })
    } catch ({ name, message}) {
        next({name, message});
    }
})
// POST /api/routines/:routineId/activities

module.exports = router;
