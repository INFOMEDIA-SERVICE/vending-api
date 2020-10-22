"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const clients_controller_1 = require("./clients_controller");
const router = express_1.Router();
router.post('/', clients_controller_1.clientController.signup);
router.post('/login', clients_controller_1.clientController.login);
router.get('/', clients_controller_1.clientController.getAll);
router.get('/count', clients_controller_1.clientController.getCount);
router.get('/:id', clients_controller_1.clientController.getById);
router.put('/:id', clients_controller_1.clientController.update);
router.delete('/:id', clients_controller_1.clientController.delete);
exports.default = router;
//# sourceMappingURL=clients_routes.js.map