const client = require("./client");

async function addActivityToRoutine({
  routineId,
  activityId,
  count,
  duration,
}) {
  try {
    const { rows: [ routine_activity ] } = await client.query(`
    INSERT INTO routine_activities("routineId", "activityId", count, duration)
    VALUES($1,$2,$3,$4)
    on CONFLICT ("routineId", "activityId") DO NOTHING
    RETURNING *
    `,[routineId,activityId,count, duration])
    return routine_activity
  } catch(error){
    console.log("Error adding activity to routine")
  }
    
}

async function getRoutineActivityById(id) {
  try {
    const { rows: [ routine_activities ] } = await client.query(`
    SELECT *
    FROM routine_activities
    WHERE id = ${id}
    `)
    return routine_activities
  } catch(error){
    console.log("Error getting routine activity by id")
  }
}

async function getRoutineActivitiesByRoutine({ id }) {
  try {
    const { rows:  routine_activity  } = await client.query(`
    SELECT *
    FROM routine_activities 
    WHERE "routineId"=$1
    `,[id])
    return routine_activity
  } catch(error){
    console.log("Error getting routine activities by routine")
  }
}

async function updateRoutineActivity({ id, ...fields }) {
  const setString = Object.keys(fields).map(
    (key, index) => `"${ key }"=$${ index + 1 }`
  ).join(', ');
  try {
    if (setString.length > 0) {
      const {rows:[routine_activities]} = await client.query(`
        UPDATE routine_activities
        SET ${ setString }
        WHERE id=${ id }
        RETURNING *;
      `, Object.values(fields));
      return routine_activities;
    }
  } catch(error){
    console.log("Error updating routine activity")
  }

}

async function destroyRoutineActivity(id) {
  try{
    const {rows:[routine_activities]} = await client.query(`
    DELETE FROM routine_activities
    WHERE id = ${id}
    RETURNING *;
    `)
    return routine_activities
  } catch(error){
    console.log("Error destroying routine activity")
  }
  
}

async function canEditRoutineActivity(routineActivityId, userId) {
  try {
    const {rows: [routineFromRoutineActivity]} = await client.query(`
    SELECT * FROM routine_activities
    JOIN routines ON routine_activities."routineId" = routines.id
    AND routine_activities.id = $1
  `, [routineActivityId]);
  return routineFromRoutineActivity.creatorId === userId;
}
    // const { rows: [ routine_activities ] } = await client.query(`
    // SELECT r.*, ra.* FROM routines 
    // as r
    // JOIN routine_activities as ra
    // ON r.Id = ra."routineId"
    // WHERE r."creatorId" = ${userId} 
    // AND ra."routineId" = ${routineActivityId}
    // `)
    // console.log("routine_activities", routine_activities)
    // if(routine_activities) return true;
    // return false;
   catch(error){
    console.log("Can edit routine activity")
  }
}
//create select that joins routine and routine activity tables; filter that's based on routine activity id that is passed in (can do creator id too) 

module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  canEditRoutineActivity,
}