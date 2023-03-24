const client = require("./client");
const bcrypt = require('bcrypt');
// database functions

// user functions
async function createUser({ username, password }) {
  const SALT_COUNT = 10;
  const hashedPassword = await bcrypt.hash(password, SALT_COUNT)
  //let usertoAdd = {username, hashedPassword}
  //do we need to do anything with this?
  try {
    const { rows: [ user ] } = await client.query(` 
    INSERT INTO users(username, password)
    VALUES($1, $2)
    ON CONFLICT (username) DO NOTHING
    RETURNING id, username;
    `,[username, hashedPassword])
    return user;
  } catch(error){
    console.log("Error creating user")
  }
}


async function getUser({ username, password }) {
  try{
    const user = await getUserByUsername(username);
    const hashedPassword = user.password;
    const isValid = await bcrypt.compare(password, hashedPassword)
    if(!isValid){
      return null;
     }else{
      delete user.password
      return user
     }
  } catch(error){
    console.log("Error getting user")
  }
}

async function getUserById(userId) {
 try{
  const { rows: [ user ] } = await client.query(`
  SELECT *
  FROM users
  WHERE id = ${userId} 
  `)
if (!user){
  return null
} else {
  delete user.password
  return user
}

 }catch(error){
  console.log("Error getting user id")
 }
}

async function getUserByUsername(username) {
try {
  const { rows: [ user ] } = await client.query(`
  SELECT *
  FROM users
  WHERE username=$1
  `,[username])
  return user; 
} catch(error){
  console.log("Error getting user by username")
} 
}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
}
