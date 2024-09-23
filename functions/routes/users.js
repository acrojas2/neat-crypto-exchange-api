const express = require("express");
const {isUserExist, getUserById, createUser} = require("../services/users");
const {
  createInitialUserWallets,
  getUserWallets,
  getUserWalletsRef,
  findWalletByCurrencyCode,
} = require("../services/wallets");

// eslint-disable-next-line new-cap
const router = express.Router();


router.post("/register", async (req, res) => {
  const user = req.user;
  const userId = user.uid;

  const {userRef, userDoc} = await getUserById(userId);

  if (!isUserExist(userDoc)) {
    await createUser(userRef, user.email);
    await createInitialUserWallets({userId, userRef});
    return res.status(201).send();
  } else {
    return res.status(409).json({message: "User already exists"});
  }
});

router.get("/:user_id/wallets", async (req, res) => {
  const userId = req.params.user_id;
  const wallets = await getUserWallets(userId);
  return res.status(201).json({
    wallets,
  });
});

router.get("/:user_id/wallets/:currency_code", async (req, res) => {
  const userId = req.params.user_id;
  const currencyCode = req.params.currency_code;

  const walletsRef = getUserWalletsRef(userId);

  const wallet = await findWalletByCurrencyCode(walletsRef, currencyCode);

  if (!wallet) {
    return res.status(404).json({message: "the resource has not been found"});
  }

  return res.status(201).json({
    wallet,
  });
});

module.exports = router;
