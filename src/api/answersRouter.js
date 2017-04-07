import {Router} from 'express';
import AnswersCont from '../models/answersModel'

let anwersRouter = Router();
let answers = new AnswersCont();

anwersRouter.route('/').get(function (req, res) {
    answers.getReport(function (err, result) {
        if (err) {
            res.set('Content-Type', 'application/json');
            res.status(500).send(JSON.stringify(err));
        } else {
            res.contentType('application/json').status(200);
            res.send(JSON.stringify(result));
        }
    });
});

export default anwersRouter;

