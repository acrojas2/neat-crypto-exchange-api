const express = require("express");
const {createOrder, frozenBalanceInWallets} = require("../services/orders");

// eslint-disable-next-line new-cap
const router = express.Router();

router.post("/", async (req, res) => {
  const {amount, type, currentMarketPrice, marketId} = req.body;

  const userId = req.user.uid;

  const newOrderBody = {
    amount,
    type,
    currentMarketPrice,
    userId,
    marketId,
    state: "RECEIVED",
    createdAt: new Date(),
  };

  const newOrder = await createOrder(newOrderBody);

  if (newOrder) {
    await frozenBalanceInWallets(
        marketId,
        currentMarketPrice,
        userId,
        type,
        amount,
    );

    res.status(201).json({
      order: newOrder,
    });
  }
  // To Do: hacer el caso que no se haya generado la orden
});

module.exports = router;

