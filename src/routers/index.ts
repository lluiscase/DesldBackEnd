import { Express } from 'express';
import routerUser from './user';

export default (app: Express) => {
    app.use(routerUser);
};