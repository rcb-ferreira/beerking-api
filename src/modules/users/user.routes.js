import { Router } from 'express';
import validate from 'express-validation';

import { authLocal, authJwt } from '../../services/auth.services';
import * as userController from './user.controllers';
import userValidation from './user.validations';

const routes = new Router();

routes.post('/signup', 
    validate(userValidation.signup), 
    userController.signUp
);

routes.post('/login', authLocal, userController.login);

routes.get('/', authJwt, userController.listAll);

routes.patch(
    '/:id',
    authJwt,
    validate(userValidation.signup),
    userController.updateUser
);

export default routes;
