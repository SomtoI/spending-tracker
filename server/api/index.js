const router = require("express").Router();

router.use("/spendings", require("./spendings"));
router.use("/currencies", require("./currencies"));

module.exports = router;
