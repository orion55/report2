import {Router} from 'express';
import AnswersCont from '../Controller/answersController'

let anwersRouter = Router();
let answers = new AnswersCont();

anwersRouter.route('/').get(function (req, res) {
    answers.getReport(function (err, result) {
        if (err) {
            // Error connecting to DB
            res.set('Content-Type', 'application/json');
            res.status(500).send(JSON.stringify(err));
        } else {
            res.status(200).send('Ok!');
        }
    });
});

export default anwersRouter;

