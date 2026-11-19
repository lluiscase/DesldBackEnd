import { Express } from 'express';
import routerUser from './user';
import routerAuth from './auth';
import routerAnimal from './animal';
import routerLocation from './locationAnimal';
import routerNotification from './notification';
import routerCourse from './course';
import routerPetshop from './petshop';
import routerAi from './ai';

export default (app: Express) => {
    app.use(routerUser);
    app.use(routerAuth);
    app.use(routerAnimal);
    app.use(routerLocation);
    app.use(routerNotification);
    app.use(routerCourse);
    app.use(routerPetshop);
    app.use(routerAi);
};
