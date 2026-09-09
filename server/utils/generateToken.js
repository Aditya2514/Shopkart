const jwt = require("jsonwebtoken");

const generateToken = (res, customerId) => {
  const token = jwt.sign(
    { id: customerId },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.cookie("token", token, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

module.exports = generateToken;
