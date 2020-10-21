"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const machine_controller_1 = require("./machine_controller");
const router = express_1.Router();
// router.get('/', userController.method);
router.post('/dispense', machine_controller_1.machineController.dispense);
exports.default = router;
//# sourceMappingURL=machine_routes.js.map