/* eslint-disable require-jsdoc */
const {db} = require("../config/admin-firestore");


async function getCurrencies() {
  const currenciesRef = db.collection("currencies");
  return await currenciesRef.get();
}

function getCurrencyData(currencyDoc) {
  return currencyDoc.data();
}

function assignInitalBalance(currencyCode) {
  return currencyCode == "USD" ?
    Math.floor(Math.random() * (100000 - 100 + 1) + 100) : 0;
}

function getUserWalletsRef(userId) {
  return db.collection("users")
      .doc(userId).collection("wallets");
}

async function findWalletByCurrencyCode(walletsRef, currencyCode) {
  const walletsSnapshot = await walletsRef
      .where("currencyCode", "==", currencyCode).get();
  if (walletsSnapshot.empty) {
    return null;
  }
  return walletsSnapshot.docs[0].data();
}


async function getUserWallets(userId) {
  const walletsRef = getUserWalletsRef(userId);

  const walletsSnapshot = await walletsRef.get();

  if (walletsSnapshot.empty) {
    return [];
  }
  const wallets = [];
  walletsSnapshot.forEach((doc) => {
    wallets.push({
      id: doc.id,
      ...doc.data(),
    });
  });
  return wallets;
}

async function createInitialUserWallets({userId, userRef}) {
  const currencies = await getCurrencies();

  currencies.forEach(async (currencyDoc) => {
    const currencyData = getCurrencyData(currencyDoc);

    const {code, name} = currencyData;
    const initialBalance = assignInitalBalance(code);


    const walletAttributes = {
      balance: initialBalance,
      frozenBalanceToAdd: 0,
      frozenBalanceToRemove: 0,
      currencyCode: code,
      currencyName: name,
      user_id: userId,
    };

    await userRef.collection("wallets").add({
      ...walletAttributes,
    });
  });
}

module.exports = {
  createInitialUserWallets,
  getUserWallets,
  getUserWalletsRef,
  findWalletByCurrencyCode,
};


