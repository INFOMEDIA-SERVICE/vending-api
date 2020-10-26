import {Router} from 'express';
import { vendingsController } from './vending_controller';
import { authController } from '../../utils/auth_controller';

const router:Router = Router();

router.get('/', [authController.validateAccess], vendingsController.getAll);
router.get('/count', [authController.validateAccess], vendingsController.getCount);
router.get('/:id', [authController.validateAccess], vendingsController.getById);
router.get('/:id/products', [authController.validateAccess], vendingsController.getVendingProducts);
router.post('/', [authController.validateAdminToken], vendingsController.create);
router.put('/:id', [authController.validateAdminToken], vendingsController.update);
router.delete('/:id', [authController.validateAdminToken], vendingsController.delete);

export default router;
