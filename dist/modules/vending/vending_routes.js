"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const vending_controller_1 = require("./vending_controller");
const router = express_1.Router();
router.get('/', vending_controller_1.vendingsController.getAll);
router.get('/count', vending_controller_1.vendingsController.getCount);
router.get('/:id', vending_controller_1.vendingsController.getById);
router.get('/:id/products', vending_controller_1.vendingsController.getVendingProducts);
router.post('/', vending_controller_1.vendingsController.create);
router.put('/:id', vending_controller_1.vendingsController.update);
router.delete('/:id', vending_controller_1.vendingsController.delete);
exports.default = router;
//# sourceMappingURL=vending_routes.js.map