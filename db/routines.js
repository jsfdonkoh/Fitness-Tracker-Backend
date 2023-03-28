const client = require("./client");
const {attachActivitiesToRoutines} = require("./activities");

async function createRoutine({ creatorId, isPublic, name, goal }) {
  try {
    const { rows: [ routine ] } = await client.query(`
    INSERT INTO routines("creatorId", "isPublic", "name", "goal")
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (name) DO NOTHING
    RETURNING *;
    `,[creatorId, isPublic, name, goal]);
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
    return routine
  } catch(error){
    console.log("Error getting routine by id")
  }
}

async function getRoutinesWithoutActivities() {

  try {
    const { rows:  routines } = await client.query(`
    SELECT *
    FROM routines
    `)
    return routines;
    //double check how to return array
  } catch(error){
    console.log("Error getting routines without activities")
  }
}

async function getAllRoutines() {
  try {
    const { rows: routines } = await client.query(`
    SELECT routines.*, users.username AS "creatorName"
    FROM routines
    JOIN users ON routines."creatorId" = users.id
    `)
     for(let routine of routines)
     {console.log("hello")
     console.log("routine", routine)
     console.log("routine.activity", routine.activity)
     console.log("routine.activities", routine.activities)
   }
  //console.log("routines",routines)
    //xit("includes username, from users join, aliased as creatorName", async () => {
    const result = attachActivitiesToRoutines(routines)
    console.log("result", result)
    return result
    //return routines.activities
    //how do we return all routines + their activities?
    //if change is made to return array make it here as well
    //build out routine activites so we have method to call activities - add activities to routine object 
    //need to join from a few dif tables to get act that correlate w a rroutine (many to many r'ship - solution have a middle ground table routineactivities is middle ground table - putting id's from diff tables in it)
  } catch(error){
    console.log("Error getting all routines")
  }

}
//isPublic was in parentheses (originally?)
async function getAllPublicRoutines() {
  try {
    const { rows: routines } = await client.query(`
    SELECT routines.* , users.username AS "creatorName"
    FROM routines
    JOIN users ON routines."creatorId" = users.id
    WHERE "isPublic" = true 
    `)
    //check if boolean works
    //are we passing in?
    //xit("includes username, from users join, aliased as creatorName"
    const result = attachActivitiesToRoutines(routines)
    console.log("result", result)
    return result
  } catch(error){
    console.log("Get all public routines")
  }
}

async function getAllRoutinesByUser({ username }) {
  try {
    const { rows: routines } = await client.query(`
    SELECT routines.*, users.username AS "creatorName"
    FROM routines 
    JOIN users ON routines."creatorId" = users.Id
    WHERE username=$1
    `,[username])
    const result = attachActivitiesToRoutines(routines)
    console.log("result", result)
    return result
  } catch(error){
    console.log("Get all routines by user")
  }
}

async function getPublicRoutinesByUser({ username }) {
  try {
    const { rows: routines } = await client.query(`
    SELECT routines.*, users.username AS "creatorName"
    FROM routines 
    JOIN users ON routines."creatorId" = users.Id
    WHERE username=$1 
    AND "isPublic" = true 
    `,[username])
    const result = attachActivitiesToRoutines(routines)
    console.log("result", result)
    return result
  } catch(error){
    console.log("Get all routines by user")
  }
}


async function getPublicRoutinesByActivity({ id }) {
  try {
    const { rows: routines } = await client.query(`
    SELECT routines.* , users.username AS "creatorName"
    FROM routines
    JOIN users ON routines."creatorId" = users.id
    JOIN routine_activities ON routines.Id = routine_activities."routineId"
    WHERE routines."isPublic" = true 
    AND routine_activities."activityId"=$1
    `,[id])
    //check if boolean works
    //are we passing in?
    //xit("includes username, from users join, aliased as creatorName"
    const result = attachActivitiesToRoutines(routines)
    console.log("result", result)
    return result
  } catch(error){
    console.log("Get all public routines by activity")
  }
}

async function updateRoutine({ id, ...fields }) {
  const setString = Object.keys(fields).map(
    (key, index) => `"${ key }"=$${ index + 1 }`
  ).join(', ');
  try {
    if (setString.length > 0) {
      const {rows:[routine]} = await client.query(`
        UPDATE routines
        SET ${ setString }
        WHERE id=${ id }
        RETURNING *;
      `, Object.values(fields));
      return routine;
    }
} catch (error) {
  console.log("Error updating routine")
  throw error
}

}

async function destroyRoutine(id) {
  try {
    await client.query(`
    DELETE FROM routine_activities
    WHERE "routineId" = ${id}
    RETURNING *;
    `)
    const {rows:[routine]} = await client.query(`
    DELETE FROM routines
    WHERE id = ${id}
    RETURNING *;
    `)
    return routine
  } catch(error){
    console.log("Error destroying routine by id")
  }
}

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
