import { Router} from 'express';
import UserController from "../controllers/UserController";
import ProjectController from "../controllers/ProjectController";
import {authenticateJWT} from "../middleware/authMiddleware";
import IssueController from "../controllers/IssueController";
import ColumnController from "../controllers/ColumnController";

const router = Router();

router.get('/users',       UserController.index);
router.get('/users/:id',    UserController.show);
router.post('/users',      UserController.store);
router.post('/users/login', UserController.login);
router.delete('/users/:id', UserController.destroy);

// Protect everything below with JWT
router.use(authenticateJWT);

router.get('/projects', ProjectController.index);
router.post('/projects', ProjectController.store);
router.get("/projects/:id/members", ProjectController.members);
router.post("/projects/:id/members", ProjectController.addMember);

router.get('/issues',  IssueController.index);
router.get('/issues/:id', IssueController.show);
router.post('/issues', IssueController.store);
router.put('/issues/:id', IssueController.update);
router.delete('/issues/:id', IssueController.destroy);

router.patch('/issues/:id/worklog', IssueController.updateWorkLog);

router.put('/columns/reorder', ColumnController.reorder);

router.get('/columns', ColumnController.index);
router.get('/columns/:projectId', ColumnController.show);
router.post('/columns', ColumnController.store);
router.put('/columns/:id', ColumnController.update);
router.delete('/columns/:id', ColumnController.destroy);


export default router;
