
// If we don't send a token from the Frontend we're sending back a 401, if the token is wrong, we send back a 403

import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(token, "secret", (err) => {
      if (err) {
        return res.status(403).json({ error: "Invalid token" });
      }
      next();
    });
  } else {
    res.status(401).json({ error: "Token missing" });
  }
};

// 403 not authorized user