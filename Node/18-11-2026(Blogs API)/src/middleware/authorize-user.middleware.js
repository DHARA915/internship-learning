const authorizeUser = (req, res, next) => {
  const requestedUserId = req.params.id;
  const currentUser = req.user;

  // Admin can access any user's details.
  if (currentUser.role === "admin") {
    return next();
  }

  // Other users can access only their own details.
  if (currentUser.id !== requestedUserId) {
    return res.status(403).json({
      success: false,
      message: "You can only access your own profile"
    });
  }

  next();
};

export default authorizeUser;