"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const services_controller_1 = require("./services_controller");
const auth_controller_1 = require("../../utils/auth_controller");
const router = express_1.Router();
router.post('/', [auth_controller_1.authController.validateAccess], services_controller_1.servicesController.create);
router.get('/', [auth_controller_1.authController.validateAccess], services_controller_1.servicesController.getAll);
router.get('/users/:id', [auth_controller_1.authController.validateAccess], services_controller_1.servicesController.getServicesByUser);
router.get('/vendings/:id', [auth_controller_1.authController.validateAdminToken], services_controller_1.servicesController.getServicesByMachine);
router.get('/:id', [auth_controller_1.authController.validateAccess], services_controller_1.servicesController.getById);
router.put('/:id', [auth_controller_1.authController.validateAdminToken], services_controller_1.servicesController.update);
router.delete('/:id', [auth_controller_1.authController.validateAdminToken], services_controller_1.servicesController.delete);
exports.default = router;
//# sourceMappingURL=services_routes.js.map