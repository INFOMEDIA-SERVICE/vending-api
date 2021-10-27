"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = require("./controller");
const auth_controller_1 = require("../../utils/auth_controller");
const router = express_1.Router();
router.post('/', controller_1.userController.signup);
router.post('/login', controller_1.userController.login);
router.post('/login/google/', controller_1.userController.googleLogin);
router.post('/signup/google/', controller_1.userController.googleSignup);
router.get('/me', [auth_controller_1.authController.validateUserToken], controller_1.userController.me);
router.put('/:id', [auth_controller_1.authController.validateUserToken], controller_1.userController.update);
router.delete('/:id', [auth_controller_1.authController.validateUserToken], controller_1.userController.delete);
// ADMIN
router.patch('/:id', [auth_controller_1.authController.validateAdminToken], controller_1.userController.updateStatus);
router.get('/', [auth_controller_1.authController.validateAdminToken], controller_1.userController.getAll);
router.get('/:id', [auth_controller_1.authController.validateAdminToken], controller_1.userController.getById);
exports.default = router;
//# sourceMappingURL=routes.js.map