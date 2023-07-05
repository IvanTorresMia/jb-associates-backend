import { Router } from "express";
import { getEnvVars } from "../controllers/envVarsController";

const router = Router();

router.get("/env-vars", getEnvVars);
export default router;
