require("dotenv").config();
require("./utils/database");
const express = require("express");
const addRequestId = require("express-request-id")();
const app = express();
const port = process.env.PORT || 5500;
// modules
const Facilities = require("./modules/facilities");
const GameControllers = require("./modules/game-controllers");
const Zones = require("./modules/zones");

app.use(addRequestId);
app.use(express.json());

// module registration
app.use(Facilities);
app.use(GameControllers);
app.use(Zones);

app.listen(port, (error) => {
  if (error) {
    throw new Error(error);
  }

  console.info("Server running on port:", port);
});
