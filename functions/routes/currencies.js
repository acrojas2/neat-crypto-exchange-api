const express = require("express");
const {db} = require("../config/admin-firestore");

// eslint-disable-next-line new-cap
const router = express.Router();

router.post("/currencies", async (req, res) => {
  const {code, name, type, price, updatedAt} = req.body.currency;

  const currencyRef = db.collection("currencies").doc(code);
  const currencyDoc = await currencyRef.get();

  if (!currencyDoc.exists) {
    await currencyRef.set({
      code,
      name,
      price: price || null,
      updatedAt: updatedAt || null,
      type,
    });
    const newCurrencyDoc = await currencyRef.get();
    const newCurrencyData = newCurrencyDoc.data();
    return res.status(201).json(newCurrencyData);
  }

  return res.status(409).json({message: "Currency already exists"});
});

module.exports = router;
