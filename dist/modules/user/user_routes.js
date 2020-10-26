"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("./user_controller");
const auth_controller_1 = require("../../utils/auth_controller");
const router = express_1.Router();
router.post('/', user_controller_1.userController.signup);
router.post('/login', user_controller_1.userController.login);
router.get('/', [auth_controller_1.authController.validateAdminToken], user_controller_1.userController.getAll);
router.get('/me', [auth_controller_1.authController.validateUserToken], user_controller_1.userController.me);
router.get('/:id', [auth_controller_1.authController.validateAdminToken], user_controller_1.userController.getById);
router.put('/:id', [auth_controller_1.authController.validateUserToken], user_controller_1.userController.update);
router.delete('/:id', [auth_controller_1.authController.validateAdminToken], user_controller_1.userController.delete);
exports.default = router;
//# sourceMappingURL=user_routes.js.map