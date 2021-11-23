import { Router } from 'express';
import { tokenController } from './controller';
import { authController } from '../../utils/auth_controller';

const router: Router = Router();

router.post('/', tokenController.create);
router.get('/refresh', tokenController.refreshToken);

// ADMIN

export default router;
