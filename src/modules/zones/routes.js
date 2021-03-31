const express = require("express");
const { success } = require("./../../utils/response");
const router = express.Router();

router.get("/zones", async (req, res) => {
  return res.status(200).json(success({ requestId: req.id, data: "TODO" }));
});

router.post("/zones", async (req, res) => {
  return res.status(200).json(success({ requestId: req.id, data: "TODO" }));
});

module.exports = router;
