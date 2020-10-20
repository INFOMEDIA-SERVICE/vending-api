import {Router} from 'express';
import { productsController } from '../controllers/products_controller';

const router:Router = Router();

router.get('/', productsController.getAll);
router.get('/count', productsController.getCount);
router.get('/:id', productsController.getById);
router.post('/', productsController.create);
router.put('/:id', productsController.update);
router.delete('/:id', productsController.delete);

export default router;
