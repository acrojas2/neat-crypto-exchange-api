/* eslint-disable require-jsdoc */
const {db} = require("../config/admin-firestore");

async function frozenBalanceInWallets(
    marketId, currentMarketPrice, userId, type, amount,
) {
  const [cryptoCode, fiatCode] = marketId.split("-");

  const walletsRef = db.collection("users")
      .doc(userId).collection("wallets");

  const cryptoWalletQuery =
    walletsRef.where("currencyCode", "==", cryptoCode).get();
  const fiatWalletQuery =
    walletsRef.where("currencyCode", "==", fiatCode).get();

  const [cryptoWalletSnapshot, fiatWalletSnapshot] =
    await Promise.all([cryptoWalletQuery, fiatWalletQuery]);

  const cryptoWallet =
    cryptoWalletSnapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}))[0];
  const fiatWallet =
    fiatWalletSnapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}))[0];


  const frozenCryptoAmount = amount;
  const frozenFiatAmount = currentMarketPrice * amount;

  if (type === "buy") {
    const newFiatBalance = fiatWallet.balance - frozenFiatAmount;
    const newFiatFrozenToRemoveBalance =
      (fiatWallet.frozenBalanceToRemove || 0) + frozenFiatAmount;

    const newCryptoFrozenBalance =
      (cryptoWallet.frozenBalanceToAdd || 0) + frozenCryptoAmount;

    const updateFiatWallet = walletsRef.doc(fiatWallet.id).update({
      balance: newFiatBalance,
      frozenBalanceToRemove: newFiatFrozenToRemoveBalance,
    });

    const updateCryptoWallet = walletsRef.doc(cryptoWallet.id).update({
      frozenBalanceToAdd: newCryptoFrozenBalance,
    });

    await Promise.all([updateCryptoWallet, updateFiatWallet]);
  }


  if (type === "sell") {
    // revisar
    const newCryptoBalance = cryptoWallet.balance - frozenCryptoAmount;
    const newCryptoFrozenToRemoveBalance =
      (cryptoWallet.frozenBalanceToRemove || 0) + frozenCryptoAmount;

    const newFiatBalanceToAdd =
      (fiatWallet.frozenBalanceToAdd || 0) + frozenFiatAmount;


    const updateFiatWallet = walletsRef.doc(fiatWallet.id).update({
      frozenBalanceToAdd: newFiatBalanceToAdd,
    });

    const updateCryptoWallet = walletsRef.doc(cryptoWallet.id).update({
      balance: newCryptoBalance,
      frozenBalanceToRemove: newCryptoFrozenToRemoveBalance,
    });


    await Promise.all([updateCryptoWallet, updateFiatWallet]);
  }
}

async function createOrder(newOrder) {
  const newOrderRef = await db.collection("orders").add(newOrder);
  const newOrderSnapshot = await newOrderRef.get();
  if (newOrderSnapshot.exists) {
    return newOrderSnapshot.data();
  }
  return null;
}

module.exports = {createOrder, frozenBalanceInWallets};
