import { Router } from 'express';
import projectController from '../controllers/project';
import participantController from '../controllers/participant';
import taskController from '../controllers/task';
import attachmentController from '../controllers/attachment';
import taskUpdateController from '../controllers/taskUpdate';

// import auth0Middleware from './auth0Middleware';

import { checkJwt, createIfNotExists } from './authMiddleware';

const projectRouter = Router();
projectRouter.use(checkJwt);
projectRouter.use(createIfNotExists);

// Route variables
const projectRoute = '/projects';
const projectSpecificRoute = `${projectRoute}/:projectId`;

const participantRoute = `${projectSpecificRoute}/participants`;
// const participantSpecificRoute = `${participantRoute}/:participantId`;

const taskRoute = `${projectSpecificRoute}/tasks`;
const taskSpecificRoute = `${taskRoute}/:taskId`;

const attachmentRoute = `${projectSpecificRoute}/attachments`;
const attachmentSpecificRoute = `${attachmentRoute}/:attachmentId`;

const taskUpdateRoute = `${taskSpecificRoute}/update`;
const taskUpdateSpecificRoute = `${taskUpdateRoute}/:taskUpdateId`;

// Project routes
projectRouter.post(projectRoute, projectController.create);
projectRouter.get(projectRoute, projectController.list);
projectRouter.get(projectSpecificRoute, projectController.read);
projectRouter.patch(projectSpecificRoute, projectController.update); // todo @auth ; is not protected cuz no axios/fe to call this

// Participant routes
projectRouter.post(participantRoute, participantController.create);
projectRouter.delete(participantRoute, participantController.delete);
projectRouter.get(participantRoute, participantController.list);

// Task routes
projectRouter.post(taskRoute, taskController.create);
projectRouter.get(taskRoute, taskController.list);
projectRouter.get(taskSpecificRoute, taskController.read);
projectRouter.patch(taskSpecificRoute, taskController.update);

// Attachment routes
projectRouter.post(attachmentRoute, attachmentController.create);
projectRouter.get(attachmentRoute, attachmentController.list);
projectRouter.get(attachmentSpecificRoute, attachmentController.read);
projectRouter.delete(attachmentRoute, attachmentController.delete);

// TaskUpdate routes
projectRouter.post(taskUpdateRoute, taskUpdateController.create);
projectRouter.get(taskUpdateRoute, taskUpdateController.list);
projectRouter.get(taskUpdateSpecificRoute, taskUpdateController.read);

export default projectRouter;
