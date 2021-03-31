const express = require("express");
const { success } = require("./../../utils/response");
const router = express.Router();

router.get("/game-controllers", async (req, res) => {
  return res.status(200).json(success({ requestId: req.id, data: "TODO" }));
});

router.post("/game-controllers", async (req, res) => {
  return res.status(200).json(success({ requestId: req.id, data: "TODO" }));
});

module.exports = router;
