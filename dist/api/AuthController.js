'use strict';

var Authentication = require('./authentication');
var passportService = require('../util/passport');
var passport = require('passport');
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var requireAuth = passport.authenticate('jwt', { session: false });
var requireSignin = passport.authenticate('local', { session: false });

router.use(bodyParser.urlencoded({ extended: true }));

router.get('/', requireAuth, function (req, res) {
    res.send({ message: 'Super secret code is ABC123' });
});
router.post('/signin', requireSignin, Authentication.signin);
router.post('/signup', Authentication.signup);

module.exports = router;
//# sourceMappingURL=AuthController.js.map