const mongoose = require("mongoose");

const connectionURL = process.env.DB_CONNECTION_STRING;

mongoose
  .connect(connectionURL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() =>
    console.info(`Database is runnin on port ${mongoose.connection.port}`)
  );
