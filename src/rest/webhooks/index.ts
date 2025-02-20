import { Router } from "express";
import clerkWebhook from "@/rest/webhooks/clerk-webhook";

const router = Router();

router.use("/webhook", clerkWebhook);

export default router;
