import { Express } from 'express';
import routerUser from './user';
import routerLogin from './auth';

export default (app: Express) => {
    app.use(routerUser);
    app.use(routerLogin);
};