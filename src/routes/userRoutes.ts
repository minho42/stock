import express from "express"
import { auth, authAdmin } from "../middleware/authMiddleware"
export const router = express.Router();

import {
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
} from"../controllers/userController"

router.post("/users", createUser);
router.post("/users/login", loginUser);
router.post("/users/password/reset", passwordReset);
router.post("/users/password/reset/confirm", passwordResetConfirm);
router.post("/users/logout", auth, logoutUser);
router.post("/users/logoutall", auth, logoutAllUser);
router.get("/users/check", auth, checkUser);
router.get("/users/me", auth, getUser);
router.get("/users/all", authAdmin, getAllUser);
router.patch("/users/me", auth, updateUser);
router.delete("/users/me", auth, deleteUser);
