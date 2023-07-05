"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const envVarsController_1 = require("../controllers/envVarsController");
const router = (0, express_1.Router)();
router.get("/env-vars", envVarsController_1.getEnvVars);
exports.default = router;
