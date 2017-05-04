import AnswersModel from '../models/answersModel';

let answers = new AnswersModel();
answers.getReport2({dateFrom: '04.01.2017', dateTo: '04.30.2017'})
    .then(result => {
        console.log(result);
    })
    .catch(err => {
        console.log(err);
    });