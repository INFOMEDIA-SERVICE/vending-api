"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("./user_controller");
const router = express_1.Router();
router.post('/', user_controller_1.userController.signup);
router.post('/login', user_controller_1.userController.login);
router.get('/', [], user_controller_1.userController.getAll);
router.get('/count', [], user_controller_1.userController.getCount);
router.get('/:id', [], user_controller_1.userController.getById);
router.put('/:id', [], user_controller_1.userController.update);
router.delete('/:id', [], user_controller_1.userController.delete);
exports.default = router;
//# sourceMappingURL=user_routes.js.map