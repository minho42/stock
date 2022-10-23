const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const auth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      throw new Error("no jwt from cookies");
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findOne({ _id: decoded._id, "tokens.token": token });
    if (!user) {
      throw new Error("!user");
    }
    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    res.clearCookie("token");
    // res.redirect("/login")
    res.status(401).send({ error: "Please authenticate " });
  }
};

const authAdmin = async (req, res, next) => {
  // TODO refactor: remove duplicate
  try {
    const token = req.cookies.token;
    if (!token) {
      throw new Error("no jwt from cookies");
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findOne({ _id: decoded._id, "tokens.token": token });
    if (!user) {
      throw new Error("!user");
    }
    if (!user.isSuperuser) {
      res.status(403).send({ error: "Forbidden" });
    }
    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    // res.clearCookie("token");
    res.status(401).send({ error: "Please authenticate " });
  }
};

module.exports = { auth, authAdmin };
