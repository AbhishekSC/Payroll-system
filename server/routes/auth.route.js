import express from "express";
import { loginUser, registerUser } from "../controllers/auth.controller.js";
import authenticateUser from "../middlewares/auth.middleware.js";
import roleMiddleware from "../middlewares/role.middleware.js";

const router = express.Router();

router.post("/register", authenticateUser, roleMiddleware("ADMIN"), registerUser);
router.post("/login", loginUser);

export default router;
