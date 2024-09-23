/* eslint-disable require-jsdoc */

const functions = require("firebase-functions");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const {admin} = require("./config/admin-firestore");
const {corsOptions} = require("./config/cors");

const userRoutes = require("./routes/users");
const orderRoutes = require("./routes/orders");
const currencyRoutes = require("./routes/currencies");
const marketPriceRoutes = require("./routes/market-prices");
const marketRoutes = require("./routes/markets");


const app = express();
const main = express();


app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.json());


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

app.use(verifyAtuhentication);
app.use("/users", userRoutes);
app.use("/orders", orderRoutes);
app.use("/currencies", currencyRoutes);
app.use("/market-prices", marketPriceRoutes);
app.use("/markets", marketRoutes);

main.use("/api", app);
main.use(bodyParser.json());


exports.function = functions.https.onRequest(main);
