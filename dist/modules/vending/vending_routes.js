"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const vending_controller_1 = require("./vending_controller");
const auth_controller_1 = require("../../utils/auth_controller");
const router = express_1.Router();
router.get('/', [auth_controller_1.authController.validateAccess], vending_controller_1.vendingsController.getAll);
router.get('/:id', [auth_controller_1.authController.validateAccess], vending_controller_1.vendingsController.getById);
router.get('/:id/products', [auth_controller_1.authController.validateAccess], vending_controller_1.vendingsController.getVendingProducts);
// ADMIN
router.post('/', [auth_controller_1.authController.validateAdminToken], vending_controller_1.vendingsController.create);
router.put('/:id', [auth_controller_1.authController.validateAdminToken], vending_controller_1.vendingsController.update);
router.delete('/:id', [auth_controller_1.authController.validateAdminToken], vending_controller_1.vendingsController.delete);
exports.default = router;
//# sourceMappingURL=vending_routes.js.map