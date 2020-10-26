"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const products_controller_1 = require("./products_controller");
const auth_controller_1 = require("../../utils/auth_controller");
const router = express_1.Router();
router.get('/', [auth_controller_1.authController.validateAccess], products_controller_1.productsController.getAll);
router.get('/count', [auth_controller_1.authController.validateAccess], products_controller_1.productsController.getCount);
router.get('/:id', [auth_controller_1.authController.validateAccess], products_controller_1.productsController.getById);
router.post('/', [auth_controller_1.authController.validateAdminToken], products_controller_1.productsController.create);
router.put('/:id', [auth_controller_1.authController.validateAdminToken], products_controller_1.productsController.update);
router.delete('/:id', [auth_controller_1.authController.validateAdminToken], products_controller_1.productsController.delete);
exports.default = router;
//# sourceMappingURL=products_routes.js.map