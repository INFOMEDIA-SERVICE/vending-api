import { Router } from 'express';
import { servicesController } from './services_controller';
import { authController } from '../../utils/auth_controller';

const router: Router = Router();

router.get('/', [authController.validateAccess], servicesController.getAll);
router.get('/me', [authController.validateAccess], servicesController.me);

// ADMIN

router.post('/', [authController.validateAdminToken], servicesController.create);
router.get('/:id', [authController.validateAdminToken], servicesController.getById);
router.get('/vendings/:id', [authController.validateAdminToken], servicesController.getServicesByMachine);
router.put('/:id', [authController.validateAdminToken], servicesController.update);
router.delete('/:id', [authController.validateAdminToken], servicesController.delete);

export default router;
