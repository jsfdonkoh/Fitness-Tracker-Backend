const express = require('express');
const router = express.Router();
const { requireUser } = require("./utilities");
const { 
    getRoutineById,
    getRoutineActivityById,
    getUserById,
    updateRoutineActivity,
    destroyRoutineActivity

  } = require('../db');

// PATCH /api/routine_activities/:routineActivityId

router.patch(
	'/:routineActivityId',
	requireUser,
	async (req, res, next) => {
		const id = req.params.routineActivityId;
		const userId = req.user.id;
		const { count, duration } = req.body;

		try {
			const routineActivity = await getRoutineActivityById(id);
			const routineId = routineActivity.routineId;
			const routine = await getRoutineById(routineId);
			const creatorId = routine.creatorId;
			const username = await getUserById(userId)

			if (creatorId !== userId) {
				return res.send({ 
					error: "Not owner",
					message: `User ${username.username} is not allowed to update ${routine.name}`,
					name: "Error"
				});
			}

			if (Object.keys(req.body).length === 0) {
				res.send({ message: 'Missing fields' });
			} else {
				const updatedRoutineActivity = await updateRoutineActivity({
					id,
					count,
					duration
				});

				res.send(updatedRoutineActivity);
			}
		} catch ({ name, message }) {
			next({ name, message });
		}
	}
);

// DELETE /api/routine_activities/:routineActivityId

router.delete('/:routineActivityId',requireUser, async (req, res, next) => {
		const id = req.params.routineActivityId;
		const userId = req.user.id;

		try {
			const routineActivity = await getRoutineActivityById(id);
			const routineId = routineActivity.routineId;
			const routine = await getRoutineById(routineId);
			const creatorId = routine.creatorId;
			const username = await getUserById(userId)

			if (creatorId !== userId) {
				return res.status(403).send({ 
					error: "Not owner",
					message: `User ${username.username} is not allowed to delete ${routine.name}`,
					name: "Error"
				});
			}

			const destroyedRoutineActivity = await destroyRoutineActivity(id);
			res.send(destroyedRoutineActivity);
		} catch ({ name, message }) {
			next({ name, message });
		}
	}
);

module.exports = router;
