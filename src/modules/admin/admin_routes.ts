import {Router} from 'express';
import {adminController} from './admin_controller';
import { authController } from '../../utils/auth_controller';

const router: Router = Router();

router.post('/admin/', adminController.signup);
router.post('/admin/login', adminController.login);
router.get('/admin/', [authController.validateAdminToken], adminController.getAll);
router.get('/admin/:id', [authController.validateAdminToken], adminController.getById);
router.get('/admin/me/', [authController.validateAdminToken], adminController.me);
router.put('/admin/:id', [authController.validateAdminToken], adminController.update);
router.delete('/admin/:id', [authController.validateAdminToken], adminController.delete);

export default router;
