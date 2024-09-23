/* eslint-disable require-jsdoc */

const functions = require("firebase-functions");
const express = require("express");
const bodyParser = require("body-parser");

const {verifyAtuhentication} = require("./middlewares/auth");

const cors = require("cors");
const {corsOptions} = require("./config/cors");

const {
  userRoutes,
  orderRoutes,
  currencyRoutes,
  marketPriceRoutes,
  marketRoutes,
} = require("./routes/index");


const app = express();
const main = express();


app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.json());


app.use(verifyAtuhentication);

app.use("/users", userRoutes);
app.use("/orders", orderRoutes);
app.use("/currencies", currencyRoutes);
app.use("/market-prices", marketPriceRoutes);
app.use("/markets", marketRoutes);

main.use("/api", app);
main.use(bodyParser.json());


exports.function = functions.https.onRequest(main);
