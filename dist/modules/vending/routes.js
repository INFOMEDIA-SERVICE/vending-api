"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = require("./controller");
const auth_controller_1 = require("../../utils/auth_controller");
const router = express_1.Router();
router.get('/', [auth_controller_1.authController.validateAccess], controller_1.vendingsController.getAll);
router.get('/:id', [auth_controller_1.authController.validateAccess], controller_1.vendingsController.getById);
// ADMIN
router.put('/:id', [auth_controller_1.authController.validateAdminToken], controller_1.vendingsController.update);
router.delete('/:id', [auth_controller_1.authController.validateAdminToken], controller_1.vendingsController.delete);
exports.default = router;
//# sourceMappingURL=routes.js.map