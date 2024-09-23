/* eslint-disable require-jsdoc */
const {db} = require("../config/admin-firestore");

async function getUserById(userId) {
  const userRef = db.collection("users").doc(userId);
  const userDoc = await userRef.get();
  return {userRef, userDoc};
}

function isUserExist(userDoc) {
  return userDoc.exists;
}

async function createUser(userRef, email) {
  await userRef.set({
    email,
  });
}

module.exports = {getUserById, isUserExist, createUser};
