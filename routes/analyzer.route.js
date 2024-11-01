var express = require("express");
var analyzerService = require("../services/analyzer.service");
var router = express.Router();
var analyzer = new analyzerService();

/* GET home page. */
router.get("/analyze/contract", function (req, res, next) {
  let result = analyzer.analyzeContract();
  res.send(result);
});

module.exports = router;
