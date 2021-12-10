import { Router } from "express";
import { tokenController } from "./controller";

const router: Router = Router();

router.post("/", tokenController.create);
router.post("/refresh", tokenController.refreshToken);

// ADMIN

export default router;
