import {version} from '../../package.json';
import {Router} from 'express';
import answersRoutes from './answersRouter';
import {exportXlsx} from '../util/excel'

let api = Router();

api.get('/', (req, res) => {
    exportXlsx(null, null);
    res.json({version});
});

api.use('/answers', answersRoutes);

export default api;