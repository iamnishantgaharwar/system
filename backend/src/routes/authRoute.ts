import { Router } from "express";
import { login, logout, refresh, register } from "../controller/authController";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh-token", refresh);
router.post("/logout", logout);

export default router;
