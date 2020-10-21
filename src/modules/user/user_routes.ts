import {Router} from 'express';
import {userController} from './user_controller';

const router:Router = Router();

router.post('/', userController.signup);
router.post('/login', userController.login);
router.get('/', userController.getAll);
router.get('/count', userController.getCount);
router.get('/:id', userController.getById);
router.put('/:id', userController.update);
router.delete('/:id', userController.delete);

export default router;
