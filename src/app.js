import 'dotenv/config';
import './utils/database';
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import addRequestId from 'express-request-id';
// modules
import Facilities from './modules/facilities';
import GameControllers from './modules/game-controllers';
import Zones from './modules/zones';
import Permissions from './modules/permissions';
import Roles from './modules/roles';
import { log } from './utils/common';

const app = express();
const port = process.env.PORT || 5500;

app.use(addRequestId());

/**
 * Restricting access to server using a whitelist
 */
const corsOptions = {
  origin: [
    /(localhost|127.0.0.1)./,
    // 'https://client-ui.herokuapp.com',
    // 'https://client-ui.netlify.app',
  ],
  optionsSuccessStatus: 200, // For legacy browser support
};

app.use(cors(corsOptions));

/**
 * Parse requests of content-type - application/json
 * Used to parse JSON bodies
 * WARNING!:
 *    body-parser has been deprecated
 */
app.use(express.json());

/**
 * Parse requests of content-type - application/x-www-form-urlencoded
 * Parse URL-encoded bodies
 */
app.use(express.urlencoded({ extended: true }));

/**
 * Use the express-static middleware
 */
app.use(express.static('public'));

const httpServer = createServer(app);

// module registration
app.use(Facilities);
app.use(GameControllers);
app.use(Zones);
app.use(Permissions);
app.use('/roles', Roles);

//module user
const usersPath = '/users';
app.use(usersPath, require('./modules/users/routes'));

/**
 * Set port, listen for requests
 * WARNING!!
 * app.listen(3000); will not work here, as it creates a new HTTP server
 *
 * HTTP Server useful if you want to reuse the HTTP server,
 * for example to run socket.io within the same HTTP server instance.
 */
httpServer.listen({ port }, (error) => {
  if (error) {
    throw new Error(error);
  }

  log(
    'success',
    `\nGame Controller Server listening on port ${port} ....`,
    `\n\tStart date: ${new Date()}`
  );
});
