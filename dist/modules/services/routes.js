"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = require("./controller");
const auth_controller_1 = require("../../utils/auth_controller");
const router = express_1.Router();
router.get('/me', [auth_controller_1.authController.validateAccess], controller_1.servicesController.me);
router.get('/:id', [auth_controller_1.authController.validateAccess], controller_1.servicesController.getById);
// ADMIN
router.get('/', [auth_controller_1.authController.validateAdminToken], controller_1.servicesController.getAll);
router.post('/', [auth_controller_1.authController.validateAdminToken], controller_1.servicesController.create);
router.get('/vendings/:id', [auth_controller_1.authController.validateAdminToken], controller_1.servicesController.getServicesByMachine);
router.get('/users/:id', [auth_controller_1.authController.validateAdminToken], controller_1.servicesController.getServicesByUser);
router.put('/:id', [auth_controller_1.authController.validateAdminToken], controller_1.servicesController.update);
router.delete('/:id', [auth_controller_1.authController.validateAdminToken], controller_1.servicesController.delete);
exports.default = router;
//# sourceMappingURL=routes.js.map