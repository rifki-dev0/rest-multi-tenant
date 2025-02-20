import { Router } from "express";

const router = Router();

router.get("/health-check", (req, res) => {
  res.status(200).send("Alive and well");
});

export const mainRouter = router;
