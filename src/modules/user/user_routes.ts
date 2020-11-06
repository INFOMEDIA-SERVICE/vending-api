import { Router } from 'express';
import { userController } from './user_controller';
import { authController } from '../../utils/auth_controller';

const router: Router = Router();

router.post('/', userController.signup);
router.post('/login', userController.login);
router.post('/login/google/', userController.googleLogin);
router.post('/signup/google/', userController.googleSignup);
router.get('/', [authController.validateAdminToken], userController.getAll);
router.get('/me', [authController.validateUserToken], userController.me);
router.get('/:id', [authController.validateAdminToken], userController.getById);
router.put('/:id', [authController.validateUserToken], userController.update);
router.delete('/:id', [authController.validateAdminToken], userController.delete);

export default router;
