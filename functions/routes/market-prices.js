const express = require("express");
const {db} = require("../config/admin-firestore");

// eslint-disable-next-line new-cap
const router = express.Router();

router.get("/", async (req, res) => {
  const marketPricesRef = db.collection("market-prices");
  const marketPricesSnapshot = await marketPricesRef.get();
  const marketPrices = [];

  marketPricesSnapshot.forEach((doc) => {
    marketPrices.push({
      id: doc.id,
      ...doc.data(),
    });
  });

  return res.status(201).json({
    marketPrices,
  });
});

router.get("/:market_id", async (req, res) => {
  const marketPriceRef = db.collection("market-prices")
      .doc(req.params.market_id);

  const marketPriceDoc = await marketPriceRef.get();

  if (!marketPriceDoc.exists) {
    return res.status(404).json({message: "the resource has not been found"});
  }

  const marketPrice = marketPriceDoc.data();

  return res.status(201).json({
    ...marketPrice,
  });
});

router.post("/", async (req, res) => {
  const {
    marketId,
    oneDayVariation,
    currentPrice,
    baseCurrency,
    quoteCurrency,
  } = req.body.marketPrice;

  const marketPriceRef = db.collection("market-prices").doc(marketId);

  const marketPriceDoc = await marketPriceRef.get();

  if (!marketPriceDoc.exists) {
    await marketPriceRef.set({
      marketId,
      oneDayVariation,
      currentPrice,
      baseCurrency,
      quoteCurrency,
    });
    const newMarketPriceDoc = await marketPriceRef.get();
    const newMarketPrice = newMarketPriceDoc.data();
    return res.status(201).json(newMarketPrice);
  }

  return res.status(409).json({message: "the resource already exists"});
});


module.exports = router;
