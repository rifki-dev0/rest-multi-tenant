import { Router } from "express";
import tenantRoute from "@/rest/routes/tenant.route";

const router = Router();

router.get("/health-check", (req, res) => {
  res.status(200).send("Alive and well");
});

router.use("/tenant", tenantRoute);

export const mainRouter = router;
