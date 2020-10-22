import {Router} from 'express';
import { vendingsController } from './vending_controller';

const router:Router = Router();

router.get('/', vendingsController.getAll);
router.get('/count', vendingsController.getCount);
router.get('/:id', vendingsController.getById);
router.get('/:id/products', vendingsController.getVendingProducts);
router.post('/', vendingsController.create);
router.put('/:id', vendingsController.update);
router.delete('/:id', vendingsController.delete);

export default router;
