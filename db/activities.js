const id = require('faker/lib/locales/id_ID');
const client = require('./client');

// database functions
async function createActivity({ name, description }) {
  // return the new activity
try {
  const { rows: [ activity ]} = await client.query(`
  INSERT INTO activities(name, description)
  VALUES($1,$2)
  ON CONFLICT (name) DO NOTHING
  RETURNING *
  `,[name, description])
  return activity;
} catch (error) {
  console.log("Error creating activity")
  throw error
}
}

async function getAllActivities() {
  // select and return an array of all activities 
try {
  const { rows:  activities} = await client.query(`
  SELECT *
  FROM activities
  `)
  return activities;
} catch (error) {
  console.log("Error getting AllActivities")
  throw error
}
}

async function getActivityById(id) {
try {
  const { rows: [ activity ] } = await client.query(`
  SELECT *
  FROM activities
  WHERE id=${id}
  `)
  return activity;
} catch (error) {
  console.log("Error getting activity by id")
  throw error
}
}


async function getActivityByName(name) {
  try {
    const { rows: [ activity ] } = await client.query(`
    SELECT *
    FROM activities
    WHERE name=$1
    `,[name])
    return activity
  } catch(error){
    console.log("Error getting activity by name")
  }
}

// used as a helper inside db/routines.js
async function attachActivitiesToRoutines(routines) {}

async function updateActivity({ id, ...fields }) {
  // don't try to update the id
  // do update the name and description
  // return the updated activity
  const setString = Object.keys(fields).map(
    (key, index) => `"${ key }"=$${ index + 1 }`
  ).join(', ');
  try {
    if (setString.length > 0) {
      const {rows} = await client.query(`
        UPDATE activities
        SET ${ setString }
        WHERE id=${ id }
        RETURNING *;
      `, Object.values(fields));
      return rows[0];
    }
} catch (error) {
  console.log("Error updating activity")
  throw error
}
}
//check on this class Wednesday, 22 March 

module.exports = {
  getAllActivities,
  getActivityById,
  getActivityByName,
  attachActivitiesToRoutines,
  createActivity,
  updateActivity,
};
