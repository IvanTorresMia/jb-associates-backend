import { Router } from 'express';
import { createUser, editUser, getCurrentUser, getUser, loginUser, searchUsers } from '../controllers/userController';

const router = Router();

router.post('/', createUser);
router.post('/login', loginUser);
router.get('/search/:name', searchUsers);
router.get('/current', getCurrentUser);
router.get('/:id', getUser);
router.put('/:id', editUser);

export default router;