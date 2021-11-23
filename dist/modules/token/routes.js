"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = require("./controller");
const router = express_1.Router();
router.post('/', controller_1.tokenController.create);
router.get('/refresh', controller_1.tokenController.refreshToken);
// ADMIN
exports.default = router;
//# sourceMappingURL=routes.js.map