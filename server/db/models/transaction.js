const Sequelize = require("sequelize");
const db = require("../db");

const Transaction = db.define(
  "transaction",
  {
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
    },
    amount: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },
    currency: {
      type: Sequelize.STRING,
    },
    date: {
      type: Sequelize.DATE,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Get all transactions between startDate and endDate
 *
 * @param {Date} startDate
 * @param {Date} endDate
 * @returns Array<Transaction>
 */
Transaction.getTransactionsForRange = async function (startDate, endDate) {
  return Transaction.findAll({
    where: {
      date: {
        [Sequelize.Op.between]: [startDate, endDate],
      },
    },
  });
};

module.exports = Transaction;
