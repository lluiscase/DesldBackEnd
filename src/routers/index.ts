import { Express } from 'express';
import routerUser from './user';
import routerLogin from './auth';
import routerAnimal from './animal';

export default (app: Express) => {
    app.use(routerUser);
    app.use(routerLogin);
    app.use(routerAnimal)
};