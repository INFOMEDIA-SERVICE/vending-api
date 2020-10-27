"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_controller_1 = require("./admin_controller");
const auth_controller_1 = require("../../utils/auth_controller");
const router = express_1.Router();
router.post('/admin/', admin_controller_1.adminController.signup);
router.post('/admin/login', admin_controller_1.adminController.login);
router.get('/admin/', [auth_controller_1.authController.validateAdminToken], admin_controller_1.adminController.getAll);
router.get('/admin/:id', [auth_controller_1.authController.validateAdminToken], admin_controller_1.adminController.getById);
router.get('/admin/me/', [auth_controller_1.authController.validateAdminToken], admin_controller_1.adminController.me);
router.put('/admin/:id', [auth_controller_1.authController.validateAdminToken], admin_controller_1.adminController.update);
router.delete('/admin/:id', [auth_controller_1.authController.validateAdminToken], admin_controller_1.adminController.delete);
exports.default = router;
//# sourceMappingURL=admin_routes.js.map