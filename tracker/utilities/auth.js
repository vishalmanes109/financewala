const jwt = require("jsonwebtoken");
module.exports = {
  // valdationg the token and giving permission
  checkToken: (req, res, next) => {
    let token = req.get("authorization");
    console.log(req.headers);
    if (!req.headers.authorization) {
      return res.stutus(401).send("Unauthorized Access");
    }
    if (token) {
      // Remove Bearer from string
      token = token.slice(7);
      jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
        if (err) {
          return res.status(401).json({
            success: 0,
            message: "Invalid Token...",
          });
        } else {
          req.decoded = decoded;
          next();
        }
      });
    } else {
      // no token is found
      return res.status(401).json({
        success: 0,
        message: "Access Denied! Unauthorized User",
      });
    }
  },

  verifyToken(req, res, next) {
    console.log(req.headers);

    if (!req.headers.authorization) {
      return res.status(401).send("Unauthorized request");
    }
    let token = req.headers.authorization.split(" ")[1];
    if (token === "null") {
      return res.status(401).send("Unauthorized request");
    }

    try {
      let payload = jwt.verify(token, process.env.JWT_KEY);

      if (!payload) {
        return res.status(401).send("Unauthorized request");
      }
      req.userId = payload.subject;
      next();
    } catch (err) {
      return res.status(401).send("Unauthorized request");
    }
  },
};
