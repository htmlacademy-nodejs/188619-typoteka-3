'use strict';

module.exports = async (req, res, next) => {
  const {user} = req.session;
  const isAdmin = user && user.isAdmin;

  if (isAdmin) {
    return next();
  }

  return res.redirect(`/login`);
};
