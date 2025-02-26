import { Router } from "express";
import * as controller from "../../non-tenanted/controllers/tenant.controller";

const router = Router();

//create tenant
router.post("/", [controller.createTenant]);

export default router;
