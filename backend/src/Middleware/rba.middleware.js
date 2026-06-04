export const authorizedRoles = (...roles) => {
  return (req, res, next) => {
    if (roles.includes(req.user.role)) {
      next();
    } else {
      return res.status(403).json({
        status: 'fail',
        message: 'You are not authorized to access this route',
      });
    }
  };
};
