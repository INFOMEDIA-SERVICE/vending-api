"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const clients_controller_1 = require("./clients_controller");
const auth_controller_1 = require("../../utils/auth_controller");
const router = express_1.Router();
router.post('/', clients_controller_1.clientController.signup);
router.post('/login', clients_controller_1.clientController.login);
router.get('/', [auth_controller_1.authController.validateAdminToken], clients_controller_1.clientController.getAll);
router.get('/:id', [], clients_controller_1.clientController.getById);
router.get('/user/me/', [auth_controller_1.authController.validateClientToken], clients_controller_1.clientController.me);
router.put('/:id', [auth_controller_1.authController.validateClientToken], clients_controller_1.clientController.update);
router.delete('/:id', [auth_controller_1.authController.validateAdminToken], clients_controller_1.clientController.delete);
exports.default = router;
//# sourceMappingURL=clients_routes.js.map