import express from "express";
import { registerUser, loginUser, logoutUser, refreshAccessToken } from "../controllers/user.controller.js";
import { upload } from "../middlewares/Multer.middleware.js";
import { verifyJWT } from "../middlewares/Auth.middleware.js";
const router = express.Router();

router.post("/register", upload.fields([{ name: "avatar", maxCount: 1 }, { name: "coverImage", maxCount: 1 }]), registerUser);
router.post('/login', loginUser);
// secured routes
router.post('/logout', verifyJWT, logoutUser);
router.post('/refresh-token', refreshAccessToken);

export default router;