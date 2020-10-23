import {Router} from 'express';
import {clientController} from './clients_controller';
import { authController } from '../../utils/auth_controller';

const router:Router = Router();

router.post('/', clientController.signup);
router.post('/login', clientController.login);
router.get('/', [authController.validateAdminToken], clientController.getAll);
router.get('/:id', [], clientController.getById);
router.get('/user/me/', [authController.validateClientToken], clientController.me);
router.put('/:id', [authController.validateClientToken], clientController.update);
router.delete('/:id', [authController.validateAdminToken], clientController.delete);

export default router;
