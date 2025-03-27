module.exports = {
  ensureAuthenticatedApi: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }

    // Always return JSON for API routes
    res.status(401).json({
      success: false,
      message: "Authentication required",
      error: {
        code: "UNAUTHORIZED",
        status: 401,
        redirectUrl: "/login?returnUrl=" + encodeURIComponent(req.originalUrl),
      },
    });
  },
};
