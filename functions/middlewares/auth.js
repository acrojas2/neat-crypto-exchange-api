/* eslint-disable require-jsdoc */

const {admin} = require("../config/admin-firestore");

async function verifyAtuhentication(req, res, next) {
  if (!req.headers.authorization ||
          !req.headers.authorization.startsWith("Bearer ")) {
    return res.status(403).json({error: "No token provided"});
  }

  const token = req.headers.authorization.split(" ")[1];

  try {
    const decodedIdToken = await admin.auth().verifyIdToken(token);
    req.user = decodedIdToken;
    next();
  } catch (err) {
    return res.status(403).json({error: "Unauthorized"});
  }
}

module.exports = {verifyAtuhentication};
