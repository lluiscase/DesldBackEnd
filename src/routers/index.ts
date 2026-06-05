import { Express } from 'express';
import routerUser from './user';
import routerLogin from './auth';
import routerAnimal from './animal';
import routerLocation from './locationAnimal';

export default (app: Express) => {
    app.use(routerUser);
    app.use(routerLogin);
    app.use(routerAnimal);
    app.use(routerLocation);
};