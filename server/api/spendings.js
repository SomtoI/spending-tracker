const router = require("express").Router();

const Transaction = require("../db/models/transaction");
const {
  DAILY,
  MONTHLY,
  YEARLY,
  resolveDateRange,
} = require("../utils/helpers");

const methodNotAllowed = (req, res, next) => {
  return res.header("Allow", "GET").sendStatus(405);
};

const formatDate = (date, frame) => {
  switch (frame) {
    case DAILY:
      return date.toLocaleDateString("en-US");
    case MONTHLY:
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      });
    case YEARLY:
      return date.toLocaleDateString("en-US", { year: "numeric" });
    default:
      return "";
  }
};

const incrementDate = (date, frame) => {
  switch (frame) {
    case DAILY:
      return new Date(date.setDate(date.getDate() + 1));
    case MONTHLY:
      return new Date(date.setMonth(date.getMonth() + 1));
    case YEARLY:
      return new Date(date.setFullYear(date.getFullYear() + 1));
    default:
      return date;
  }
};

const getSpending = async (req, res, next) => {
  const { query } = req;
  const range = parseInt(query.range) || 6;
  const frame = query.frame || DAILY;

  if (!Number.isInteger(range) || range < 1) {
    res.status(400).json({
      error: "Invalid range parameter. Must be a positive integer.",
    });
    return;
  }
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
    const dateString = formatDate(date, frame);

    if (dateString in totalAmountMap) {
      totalAmountMap[dateString] += transaction.amount;
    } else {
      totalAmountMap[dateString] = transaction.amount;
    }
  }

  const formattedSpendingData = [];

  // Include the current day/month/year in the spending data
  formattedSpendingData.push({
    totalAmount: 0,
    startDate: formatDate(new Date(), frame),
  });

  // Add spending data for each day/month/year in the range
  let currentDate = new Date(from);
  while (currentDate <= to) {
    const dateString = formatDate(currentDate, frame);

    if (!(dateString in totalAmountMap)) {
      formattedSpendingData.push({
        totalAmount: 0,
        startDate: dateString,
      });
    } else {
      formattedSpendingData.push({
        totalAmount: +totalAmountMap[dateString].toFixed(2),
        startDate: dateString,
      });
    }

    incrementDate(currentDate, frame);
  }

  const data = {
    spendings: formattedSpendingData.sort(function (a, b) {
      return new Date(a.startDate) - new Date(b.startDate);
    }),
  };

  return res.json(data);
};

router.route("/").get(getSpending).all(methodNotAllowed);

module.exports = router;
