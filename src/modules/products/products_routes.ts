import {Router} from 'express';
import { productsController } from './products_controller';
import { authController } from '../../utils/auth_controller';

const router:Router = Router();

router.get('/', [authController.validateAccess], productsController.getAll);
router.get('/:id', [authController.validateAccess], productsController.getById);

// router.post('/', productsController.create);
// router.put('/:id', productsController.update);

// ADMIN

router.put('/:id', [authController.validateAdminToken], productsController.update);
router.post('/', [authController.validateAdminToken], productsController.create);
router.delete('/:id', [authController.validateAdminToken], productsController.delete);

export default router;
