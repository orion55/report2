import {version} from '../../package.json';
import {Router} from 'express';
import answersRoutes from './answersRouter';

let api = Router();

api.get('/', (req, res) => {
    res.json({version});
});

api.use('/answers', answersRoutes);

export default api;