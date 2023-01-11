import { Router } from 'express';
import * as ResourcesController from '../controllers/resources.controller';
import { verifyToken } from '../middlewares/verifyToken';
const router = Router();

/* router.get('/films', verifyToken, ResourcesController.films);
router.get('/species', verifyToken, ResourcesController.species);
router.get('/starships', verifyToken, ResourcesController.starships);
router.get('/vehicles', verifyToken, ResourcesController.vehicles);
router.get('/planets', verifyToken, ResourcesController.planets); */

router.get('/:type', verifyToken, ResourcesController.getResource)
router.get('/', verifyToken, ResourcesController.person);

export default router;