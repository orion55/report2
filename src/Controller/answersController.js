import Db from '../models/db';

let dbOrcl = new Db();

export default class answersController {
    getReport(cb) {
        dbOrcl.connect(function (err, connection) {
            if (err) {
                cb({
                        status: 500,
                        message: "Error connecting to DB",
                        detailed_message: err.message
                    },
                    null);
            }



        })
    }
}