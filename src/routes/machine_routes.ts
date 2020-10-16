import {Router} from 'express';
import {machineController} from '../controllers/machine_controller';

const router:Router = Router();

// router.get('/', userController.method);
router.post('/dispense', machineController.dispense);

export default router;
