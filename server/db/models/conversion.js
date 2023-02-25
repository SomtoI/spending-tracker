const Sequelize = require("sequelize");
const db = require("../db");

const Conversion = db.define("conversion", {
  id: {
    type: Sequelize.NUMBER,
    primaryKey: true,
  },
  rate: {
    type: Sequelize.FLOAT,
    allowNull: false,
  },
  from: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  to: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

/**
 * Returns the exchange rate for the requested pair of currency.
 */
Conversion.findExchangeRate = async function (from, to) {
  return Conversion.findOne({
    where: { from, to },
  });
};

module.exports = Conversion;
