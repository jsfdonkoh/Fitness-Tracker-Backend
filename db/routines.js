const client = require("./client");

async function createRoutine({ creatorId, isPublic, name, goal }) {
  try {
    const { rows: [ routine ] } = await client.query(`
    INSERT into routines("creatorId", "isPublic", name, goal)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (name) DO NOTHING
    RETURNING *
    `[creatorId, isPublic, name, goal])
    return routine
  } catch(error){
    console.log("Error creating routine")
  }
}

async function getRoutineById(id) {
  try {
    const { rows: [ routine ] } = await client.query(`
    SELECT *
    FROM routines
    WHERE routines.id = ${id} 
    `)
    //double check WHERE is correct in class on Wednesday 
    return routine
  } catch(error){
    console.log("Error getting routine by id")
  }
}

async function getRoutinesWithoutActivities() {

  try {
    const { rows: [ routines ] } = await client.query(`
    SELECT *
    FROM routines
    `)
    return routines
    //double check how to return array in class
  } catch(error){
    console.log("Error getting routines without activities")
  }
}

async function getAllRoutines() {
  try {
    const { rows: routines } = await client.query(`
    SELECT routines.*, user.username AS "creatorName"
    FROM routines
    JOIN users ON routines "tagId"
    `)
    
    //xit("includes username, from users join, aliased as creatorName", async () => {
    return routines
    //how do we return all routines + their activities?
    //if change is made to return array make it here as well
  } catch(error){
    console.log("Error getting all routines")
  }

}

async function getAllPublicRoutines(isPublic) {
  try {
    const { rows: routines } = await client.query(`
    SELECT routines.* , user.username AS "creatorName"
    FROM routines
    JOIN users ON routines
    WHERE isPublic = true 
    `)
    //check if boolean works
    //are we passing in?
    //xit("includes username, from users join, aliased as creatorName"
    return routines 
  } catch(error){
    console.log("Get all public routines")
  }
}

async function getAllRoutinesByUser({ username }) {
  try {
    const { rows: routines } = await client.query(`
    SELECT routines.*, user.username AS "creatorName"
    FROM routines 
    JOIN 
    `)
    return ..
  } catch(error){
    console.log("")
  }
}

async function getPublicRoutinesByUser({ username }) {}

async function getPublicRoutinesByActivity({ id }) {}

async function updateRoutine({ id, ...fields }) {}

async function destroyRoutine(id) {}

module.exports = {
  getRoutineById,
  getRoutinesWithoutActivities,
  getAllRoutines,
  getAllPublicRoutines,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
  getPublicRoutinesByActivity,
  createRoutine,
  updateRoutine,
  destroyRoutine,
};
