/* eslint-disable no-console */
const fs = require("fs");

const { DateTime, Interval } = require("luxon");
const db = require("../db");

const Transaction = require("../models/transaction");
const Conversion = require("../models/conversion");
const rawTransactions = fs.readFileSync("db/seed/transactions.json");
const rawConversions = fs.readFileSync("db/seed/conversions.json");
const { transactions } = JSON.parse(rawTransactions);
const { conversions } = JSON.parse(rawConversions);

const strToDate = (dateStr) => DateTime.fromJSDate(new Date(dateStr));

async function seed() {
  await db.sync({ force: true });
  console.log("db schema synced!");

  // Transactions
  let latestDateFound = strToDate(transactions[0].date);
  transactions.forEach((transaction) => {
    if (strToDate(transaction.date) > latestDateFound) {
      latestDateFound = strToDate(transaction.date);
    }
  });

  const today = DateTime.now();
  const diff = Interval.fromDateTimes(
    latestDateFound.startOf("day"),
    today.startOf("day")
  );
  const dayOffset = diff.length("days");

  for (const transactionJSON of transactions) {
    const transactionDate = strToDate(transactionJSON.date);
    const shiftedTransactionDate = transactionDate.plus({
      days: dayOffset,
    });
    await Transaction.create({
      id: transactionJSON.id,
      amount: transactionJSON.amount,
      currency: transactionJSON.currency,
      date: shiftedTransactionDate.toSQL(),
    });
  }

  // Conversions
  for (const conversionJSON of conversions) {
    await Conversion.create({
      id: conversionJSON.id,
      from: conversionJSON.from,
      to: conversionJSON.to,
      rate: conversionJSON.rate,
    });
  }
  console.log("seeded transactions and conversions");
}

async function runSeed() {
  console.log("seeding...");
  try {
    await seed();
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  }
}

if (module === require.main) {
  runSeed();
}

module.exports = { runSeed };
