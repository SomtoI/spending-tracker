const router = require("express").Router();

const Transaction = require("../db/models/transaction");
const { DAILY, resolveDateRange } = require("../utils/helpers");

const methodNotAllowed = (req, res, next) => {
  return res.header("Allow", "GET").sendStatus(405);
};

const getSpending = async (req, res, next) => {
  const { query } = req;
  const range = query.range ?? 6;
  const frame = query.frame ?? DAILY;

  /*
   * Run `npm run seed` to refresh your database with transactions closer to-date
   */
  const { from, to } = resolveDateRange(frame, range);
  const transactions = await Transaction.getTransactionsForRange(from, to);
  const totalAmountMap = {};

  for (const transaction of transactions) {
    /*
     * Groups transactions per day
     */
    const date = new Date(transaction.date);
    const dateString = date.toLocaleDateString("en-US");

    if (dateString in totalAmountMap) {
      totalAmountMap[dateString] += transaction.amount;
    } else {
      totalAmountMap[dateString] = transaction.amount;
    }
  }

  const formattedSpendingData = [];

  Object.keys(totalAmountMap).forEach((date) => {
    formattedSpendingData.push({
      totalAmount: +totalAmountMap[date].toFixed(2),
      startDate: new Date(date).toISOString(),
    });
  });

  const data = {
    spendings: formattedSpendingData.sort(function (a, b) {
      return new Date(a.startDate) - new Date(b.startDate);
    }),
  };

  return res.json(data);
};

router.route("/").get(getSpending).all(methodNotAllowed);

module.exports = router;
