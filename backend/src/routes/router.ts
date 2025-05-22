import {Router} from 'express';
import UserController from "../controllers/UserController";
import ProjectController from "../controllers/ProjectController";
import {authenticateJWT} from "../middleware/authMiddleware";
import IssueController from "../controllers/IssueController";
import ColumnController from "../controllers/ColumnController";
import WorklogController from "../controllers/WorklogController";

const router = Router();

router.get('/users', UserController.index);
router.get('/users/:id', UserController.show);
router.post('/users', UserController.store);
router.post('/users/login', UserController.login);
router.delete('/users/:id', UserController.destroy);

// Protect everything below with JWT
router.use(authenticateJWT);

router.get('/projects', ProjectController.index);
router.post('/projects', ProjectController.store);
router.get("/projects/:id/members", ProjectController.members);
router.post("/projects/:id/members", ProjectController.addMember);
router.get("/projects/:projectId/worklogs", WorklogController.projectWorklogSummary);
router.get("/projects/:projectId/users/:userId/worklogs", WorklogController.listUserWorklogs);
router.delete('/projects/:id/users/:userId', ProjectController.removeUser);
router.put('/projects/:id', ProjectController.update);
router.delete('/projects/:id', ProjectController.destroy)
router.get('/projects/:id', ProjectController.show);

router.get('/issues', IssueController.index);
router.get('/issues/:id', IssueController.show);
router.post('/issues', IssueController.store);
router.put('/issues/:id', IssueController.update);
router.delete('/issues/:id', IssueController.destroy);

router.get('/issues/:id/worklog', WorklogController.getIssueWorklog);
router.post('/issues/:id/worklog', WorklogController.logWork);

router.put('/columns/reorder', ColumnController.reorder);

router.get('/columns', ColumnController.index);
router.get('/columns/:projectId', ColumnController.show);
router.post('/columns', ColumnController.store);
router.put('/columns/:id', ColumnController.update);
router.delete('/columns/:id', ColumnController.destroy);


export default router;
