import {Router} from 'express';
import { productsController } from './products_controller';
import { authController } from '../../utils/auth_controller';

const router:Router = Router();

router.get('/', [authController.validateAccess], productsController.getAll);
router.get('/:id', [authController.validateAccess], productsController.getById);
// router.post('/', [authController.validateAdminToken], productsController.create);
router.post('/', productsController.create);
// router.put('/:id', [authController.validateAdminToken], productsController.update);
router.put('/:id', productsController.update);
router.delete('/:id', [authController.validateAdminToken], productsController.delete);

export default router;
