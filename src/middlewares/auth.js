import jwt from 'jsonwebtoken';
import { error } from './../utils/response';

const validateAuthentication = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res
      .status(403)
      .json(
        error({ requestId: req.id, code: 403, message: 'Missing auth header' })
      );
  }

  const [, accessToken] = authHeader.split(' ');

  jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET, (err, user) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res
          .status(401)
          .json(
            error({ requestId: req.id, code: 401, message: 'Token expired' })
          );
      }
      return res
        .status(403)
        .json(
          error({ requestId: req.id, code: 403, message: 'Token not valid' })
        );
    }
    req.user = user;
    next();
  });
};

const verifyToken = (req, res, next) => {
  const id = req.user.data._id;

  if (req.query && req.query.userId && req.query.userId === id) {
    return next();
  }

  if (req.body && req.body.userId && req.body.userId === id) {
    return next();
  }

  if (req.params && req.params.userId && req.params.userId === id) {
    return next();
  }

  if (!req.body && !req.params.userId && !req.query.userId) {
    return next();
  }

  res.status(401).json({
    success: false,
    error: 'User not allowed to perform this action.',
  });
};

export default { validateAuthentication, verifyToken };
