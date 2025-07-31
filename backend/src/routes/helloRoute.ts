import { Router } from "express";
import { authenticateToken } from "../middleware/auth";

const router = Router()
// Required authentication

router.get("/hello", authenticateToken, (req, res) => {
    res.json({ 
        message: "Hello World",
        user: req.user // This will contain the decoded user information from the JWT
    });
});

export default router
