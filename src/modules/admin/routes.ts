import { Router } from 'express';
import { adminController } from './controller';
import { authController } from '../../utils/auth_controller';

const router: Router = Router();

router.post('/', adminController.signup);
router.post('/login', adminController.login);
router.get('/', [authController.validateAdminToken], adminController.getAll);
router.get('/me', [authController.validateAdminToken], adminController.me);
router.get('/:id', [authController.validateAdminToken], adminController.getById);
router.put('/:id', [authController.validateAdminToken], adminController.update);
router.delete('/:id', [authController.validateAdminToken], adminController.delete);

export default router;
