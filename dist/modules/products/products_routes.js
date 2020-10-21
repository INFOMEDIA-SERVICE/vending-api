"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const products_controller_1 = require("./products_controller");
const router = express_1.Router();
router.get('/', products_controller_1.productsController.getAll);
router.get('/count', products_controller_1.productsController.getCount);
router.get('/:id', products_controller_1.productsController.getById);
router.post('/', products_controller_1.productsController.create);
router.put('/:id', products_controller_1.productsController.update);
router.delete('/:id', products_controller_1.productsController.delete);
exports.default = router;
//# sourceMappingURL=products_routes.js.map