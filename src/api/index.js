import {version} from '../../package.json';
import {Router} from 'express';
import answersRoutes from './answersRouter';
import UserController from './UserController';
import AuthController from './AuthController';


let api = Router();

api.get('/', (req, res) => {
    res.json({version});
});

api.use('/answers', answersRoutes);
api.use('/users', UserController);
api.use('/auth', AuthController);


export default api;