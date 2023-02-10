import { Request, Response } from 'express'
import  {User} from"../models/userModel"

export const createUser = async (req:Request, res:Response) => {
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

export const loginUser = async (req:Request, res:Response) => {
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

export const logoutUser = async (req:Request, res:Response) => {
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

export const logoutAllUser = async (req:Request, res:Response) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.clearCookie("token");
    res.send();
  } catch (error) {
    res.status(500).send();
  }
};

export const updateUser = async (req:Request, res:Response) => {
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

export const deleteUser = async (req:Request, res:Response) => {
  try {
    await req.user.remove();
    res.clearCookie("token");
    res.send(req.user);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

export const getAllUser = async (req:Request, res:Response) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
};

export const getUser = async (req:Request, res:Response) => {
  res.send(req.user);
};

export const checkUser = async (req:Request, res:Response) => {
  res.send(req.user);
};

export const passwordReset = async (req:Request, res:Response) => {
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

export const passwordResetConfirm = async (req:Request, res:Response) => {
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
