// content_security_policy_middleware.js
const contentSecurityPolicy = (req, res, next) => {
    res.setHeader("Content-Security-Policy", "frame-src 'self' https://www.facebook.com;");
    next();
};

module.exports = contentSecurityPolicy;
