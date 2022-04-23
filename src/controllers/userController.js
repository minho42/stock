const User = require("../models/userModel");

const createUser = async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    // const token = await user.generateAuthToken();
    // if (!token) {
    //   throw new Error("no token");
    // }
    res.status(201).send({ user });
  } catch (error) {
    console.log(error);
    await user.remove();
    res.status(400).send(error);
  }
};

const loginUser = async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password);
    const token = await user.generateAuthToken();

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
    res.send({ user });
  } catch (error) {
    console.log(error);
    res.status(400).send();
  }
};

const logoutUser = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.clearCookie("token");
    res.send();
  } catch (error) {
    res.status(500).send();
  }
};

const logoutAllUser = async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.clearCookie("token");
    res.send();
  } catch (error) {
    res.status(500).send();
  }
};

const updateUser = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password"];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();
    res.send(req.user);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

const deleteUser = async (req, res) => {
  try {
    await req.user.remove();
    res.clearCookie("token");
    res.send(req.user);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

const getAllUser = async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
};

const getUser = async (req, res) => {
  res.send(req.user);
};

const checkUser = async (req, res) => {
  res.send(req.user);
};

const passwordReset = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      throw new Error("Couldn't find that email");
    }
    const token = await user.generatePasswordResetToken();
    console.log("passwordResetToken: " + token);
    // TODO
    res.send({ user });
  } catch (error) {
    res.status(500).send();
  }
};

const passwordResetConfirm = async (req, res) => {
  try {
    const user = await User.findOne({ passwordResetToken: req.body.token });
    if (!user) {
      throw new Error("Token not valid");
    }
    console.log("token valid, can proceed to change password");
    res.send({ user });
    // TODO Need to remove passwordResetToken once password reset
  } catch (error) {
    res.status(400).send();
  }
};

module.exports = {
  createUser,
  loginUser,
  logoutUser,
  logoutAllUser,
  updateUser,
  deleteUser,
  getUser,
  getAllUser,
  checkUser,
  passwordReset,
  passwordResetConfirm,
};
