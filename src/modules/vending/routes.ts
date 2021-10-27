import { Router } from 'express';
import { vendingsController } from './controller';
import { authController } from '../../utils/auth_controller';

const router: Router = Router();

router.get('/', [authController.validateAccess], vendingsController.getAll);
router.get('/:id', [authController.validateAccess], vendingsController.getById);

// ADMIN
router.put('/:id', [authController.validateAdminToken], vendingsController.update);
router.delete('/:id', [authController.validateAdminToken], vendingsController.delete);

export default router;
