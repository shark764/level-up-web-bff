const jwt = require('jsonwebtoken');
const { error } = require('../utils/helpers/response');
const { removeKey } = require('../utils/redis');
const { ADMIN_ROLE, SADMIN_ROLE } = require('../models/schemas/configs/index');
const validateAccess = (req, res, next) => {
  const { authToken } = req;

  jwt.verify(authToken, process.env.JWT_AUTHORIZATION_SECRET, (err, user) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        removeKey(key, (err) => {
          if (err) {
            return res
              .status(500)
              .json(
                error({ requestId: req.id, code: 500, message: err.message })
              );
          } else {
            return res
              .status(406)
              .json(error({ requestId: req.id, code: 406 }));
          }
        });
      }
      return res
        .status(500)
        .json(error({ requestId: req.id, code: 500, message: err.message }));
    }

    req.user = user;
  });

  const roleId = req.user.data.role._id;

  return roleId === ADMIN_ROLE || roleId === SADMIN_ROLE
    ? next()
    : res.status(401).json(error({ requestId: req.id, code: 401 }));
};

module.exports = validateAccess;
