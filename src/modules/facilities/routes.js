const express = require("express");
const { success } = require("./../../utils/response");
const Facilities = require("./model");
const router = express.Router();

router.get("/facilities", async (req, res) => {
  try {
    const facilities = await Facilities.find();
    return res
      .status(200)
      .json(success({ requestId: req.id, data: { facilities } }));
  } catch (error) {
    res
      .status(500)
      .json(error({ requestId: req.id, code: 500, message: error }));
  }
});

router.post("/facilities", async (req, res) => {
  return res.status(200).json(success({ requestId: req.id, data: "TODO" }));
});

module.exports = router;
