import express from "express";

import { evaluateResources } from "../controllers/evaluationController.js";

const router = express.Router();

router.get("/", evaluateResources);

export default router;
