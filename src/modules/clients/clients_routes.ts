import {Router} from 'express';
import {clientController} from './clients_controller';

const router:Router = Router();

router.post('/', clientController.signup);
router.post('/login', clientController.login);
router.get('/', clientController.getAll);
router.get('/count', clientController.getCount);
router.get('/:id', clientController.getById);
router.put('/:id', clientController.update);
router.delete('/:id', clientController.delete);

export default router;
