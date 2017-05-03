import {Router} from 'express';
import AnswersModel from '../models/answersModel';
import {removeDuplicates} from '../util';
import XlsxModel from '../models/excel';

let anwersRouter = Router();
let answers = new AnswersModel();

anwersRouter.route('/').get(function (req, res) {
    req.checkQuery('from', 'Invalid From date').notEmpty().isDate();
    req.checkQuery('to', 'Invalid To date').notEmpty().isDate();

    req.getValidationResult()
        .then(result => {
            if (!result.isEmpty()) {
                res.set('Content-Type', 'application/json');
                res.status(500).send(JSON.stringify(removeDuplicates(result.array(), 'param')));
                return;
            }
            answers.getReport2({dateFrom: req.query.from, dateTo: req.query.to})
                .then(result => {
                    let xlsx = new XlsxModel();
                    return xlsx.exportXlsx(result.rows, result.metaData);
                })
                .then(result => {
                    const requestedUrl = req.protocol + '://' + req.get('Host');
                    result.fileUrl = requestedUrl + '/' + result.fileUrl;
                    res.contentType('application/json').status(200);
                    res.send(JSON.stringify(result));
                })
                .catch(err => {
                    res.set('Content-Type', 'application/json');
                    res.status(err.status).send(JSON.stringify(err));
                })
        });
});

export default anwersRouter;

