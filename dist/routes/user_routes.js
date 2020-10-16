"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user_controller");
const router = express_1.Router();
router.get('/', user_controller_1.userController.method);
exports.default = router;
//# sourceMappingURL=user_routes.js.map