import { Router } from 'express';
import { servicesController } from './controller';
import { authController } from '../../utils/auth_controller';

const router: Router = Router();

router.get('/me', [authController.validateAccess], servicesController.me);
router.get('/:id', [authController.validateAccess], servicesController.getById);

// ADMIN

router.get('/', [authController.validateAdminToken], servicesController.getAll);
router.post('/', [authController.validateAdminToken], servicesController.create);
router.get('/vendings/:id', [authController.validateAdminToken], servicesController.getServicesByMachine);
router.get('/users/:id', [authController.validateAdminToken], servicesController.getServicesByUser);
router.put('/:id', [authController.validateAdminToken], servicesController.update);
router.delete('/:id', [authController.validateAdminToken], servicesController.delete);

export default router;
