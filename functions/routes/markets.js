const express = require("express");
const {db} = require("../config/admin-firestore");

// eslint-disable-next-line new-cap
const router = express.Router();

router.post("/", async (req, res) => {
  const {
    id,
    baseCurrency,
    quoteCurrency,
    minOrderAmount,
  } = req.body.market;

  const marketRef = db.collection("markets").doc(id);
  const marketDoc = await marketRef.get();


  if (!marketDoc.exists) {
    await marketRef.set({
      id,
      baseCurrency,
      quoteCurrency,
      minOrderAmount,
    });
    const newMarketDoc = await marketRef.get();
    const newMarket = newMarketDoc.data();
    return res.status(201).json({market: newMarket});
  }

  return res.status(409).json({message: "Market already exists"});
});

router.get("/", async (req, res) => {
  const marketRef = db.collection("markets");
  const marketSnapshot = await marketRef.get();
  const markets = [];

  marketSnapshot.forEach((doc) => {
    markets.push({
      marketId: doc.id,
      ...doc.data(),
    });
  });

  return res.status(201).json({
    markets,
  });
});

router.get("/:market_id", async (req, res) => {
  const marketRef = db.collection("markets")
      .doc(req.params.market_id);

  const marketDoc = await marketRef.get();

  if (!marketDoc.exists) {
    return res.status(404).json({message: "the resource has not been found"});
  }

  const market = marketDoc.data();

  return res.status(201).json({
    market,
  });
});


module.exports = router;
