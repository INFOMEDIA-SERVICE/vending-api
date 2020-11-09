import { Router } from 'express';
import { servicesController } from './services_controller';
import { authController } from '../../utils/auth_controller';

const router:Router = Router();

router.post('/', [authController.validateAccess], servicesController.create);
router.get('/', [authController.validateAccess], servicesController.getAll);
router.get('/users/:id', [authController.validateAccess], servicesController.getServicesByUser);
router.get('/vendings/:id', [authController.validateAdminToken], servicesController.getServicesByMachine);
router.get('/:id', [authController.validateAccess], servicesController.getById);
router.put('/:id', [authController.validateAdminToken], servicesController.update);
router.delete('/:id', [authController.validateAdminToken], servicesController.delete);

export default router;
