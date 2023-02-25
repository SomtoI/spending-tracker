const router = require("express").Router();

const methodNotAllowed = (req, res, next) => {
  return res.header("Allow", "GET").sendStatus(405);
};

const getCurrencies = async (req, res, next) => {
  return res.json([
    { currency: "USD", default: false, symbol: "$" },
    { currency: "CAD", default: true, symbol: "$" },
    { currency: "EUR", default: false, symbol: "€" },
  ]);
};

router.route("/").get(getCurrencies).all(methodNotAllowed);

module.exports = router;
