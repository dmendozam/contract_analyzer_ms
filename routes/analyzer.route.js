var express = require("express");
var analyzerService = require("../services/analyzer.service");
var router = express.Router();
var analyzer = new analyzerService();

router.post("/analyze/contract", async function (req, res, next) {
  if (req._body && req.body.contract && req.body.language) {
    try {
      let result = await analyzer.analyzeContract(
        req.body.contract,
        req.body.language
      );
      if (result == false) {
        throw new Error("analyzeContractError");
      }
      res.send(result);
    } catch (error) {
      res.status(500).send("Server Error");
    }
  } else {
    res.status(400).send("Bad Request");
  }
});

module.exports = router;
