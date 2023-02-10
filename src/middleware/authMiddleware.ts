import { Request, Response, NextFunction } from 'express'
import jwt, {JwtPayload} from "jsonwebtoken"
import {User} from "../models/userModel"

interface IJwtPayload extends JwtPayload {
  _id: string
}

export const auth = async (req:Request, res:Response, next:NextFunction) => {
  try {
    const token:string = req.cookies.token;
    if (!token) {
      throw new Error("no jwt from cookies");
    }
    const decoded  = jwt.verify(token, process.env.JWT_SECRET_KEY) as IJwtPayload;
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

export const authAdmin = async (req:Request, res:Response, next:NextFunction) => {
  // TODO refactor: remove duplicate
  try {
    const token = req.cookies.token;
    if (!token) {
      throw new Error("no jwt from cookies");
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY) as IJwtPayload;
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

