import { Router } from "express";
import { login, logout, refresh, register } from "../controller/authController";
import { authenticateToken } from "../middleware/auth";
import { ApiResponse } from "../utils/response";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh-token", refresh);
router.post("/logout", logout);
router.get("/me", authenticateToken, (req, res) => {
    return res.status(200).json(ApiResponse.success("User Detials", req.user));
  });

export default router;  
