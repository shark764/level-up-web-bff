import { connect, connection } from 'mongoose';
import { log } from './common';

const connectionURL = process.env.DB_CONNECTION_STRING;

connect(connectionURL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
})
  .then((db) => {
    log(
      'success',
      `\nConnected to mongodb database ....`,
      `\n\tDatabase is runnin on port ${connection.port}`,
      `\n\tStart date: ${new Date()}`
    );
    log('info', `\tString connection: ${process.env.DB_CONNECTION_STRING}`);
    return db;
  })
  .catch((err) => {
    log('error', `Cannot connect to the database...`, err);
    process.exit();
  });
