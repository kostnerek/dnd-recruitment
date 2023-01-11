import { Router } from 'express';
import * as ResourcesController from '../controllers/resources.controller';
import { verifyToken } from '../middlewares/verifyToken';
const router = Router();

router.get('/:type', verifyToken, ResourcesController.getResource)

export default router;