import { Router } from 'express';
import { create, list, update } from '../controllers/todoController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.post('/', authMiddleware, create);
router.get('/', authMiddleware, list);
router.put('/:id', authMiddleware, update); // New route for updating a todo

export default router;
