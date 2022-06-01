import express from "express";
import { storeJson, retrieveJson } from "../controllers/jsonController.js";
const router = express.Router();
router.route("/:id").put(storeJson).get(retrieveJson);
export default router;
