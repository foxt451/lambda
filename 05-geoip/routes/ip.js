import { Router } from "express";
const router = Router();
import { getUserCountry } from "../controllers/ip.js";

router.get("/my-country", getUserCountry);

export default router;