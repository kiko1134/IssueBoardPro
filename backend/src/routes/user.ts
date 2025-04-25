import { Router} from 'express';
import UserController from "../controllers/UserController";

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

router.get('/',       UserController.index);
router.get('/:id',    UserController.show);
router.post('/',      UserController.store);
router.post('/login', UserController.login);
router.delete('/:id', UserController.destroy);

export default router;
