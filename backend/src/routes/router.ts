import { Router} from 'express';
import UserController from "../controllers/UserController";
import ProjectController from "../controllers/ProjectController";
import {authenticateJWT} from "../middleware/authMiddleware";

const router = Router();

// // GET /api/users
// router.get('/', async (_req: Request, res: Response) => {
//     const users = await db.User.findAll({
//         attributes: ['id','username','email','createdAt']
//     });
//     res.json(users);
// });
//
// // POST /api/users
// router.post('/', async (req: Request, res: Response) => {
//     const { username, email, password } = req.body;
//     const hash = await bcrypt.hash(password, 10);
//     const user = await db.User.create({ username, email, password: hash });
//     res.status(201).json({ id: user.id, username, email });
// });

router.get('/users',       UserController.index);
router.get('/users/:id',    UserController.show);
router.post('/users',      UserController.store);
router.post('/users/login', UserController.login);
router.delete('/users/:id', UserController.destroy);

// Protect everything below with JWT
router.use(authenticateJWT);

router.get('/projects', ProjectController.index);
router.post('/projects', ProjectController.store);

export default router;
