const Authentication = require('./authentication');
const passportService = require('../util/passport');
const passport = require('passport');
let express = require('express');
let router = express.Router();
let bodyParser = require('body-parser');

const requireAuth = passport.authenticate('jwt', {session: false});
const requireSignin = passport.authenticate('local', {session: false});

router.use(bodyParser.urlencoded({extended: true}));

router.get('/', requireAuth, function (req, res) {
    res.send({message: 'Super secret code is ABC123'});
});
router.post('/signin', requireSignin, Authentication.signin);
router.post('/signup', Authentication.signup);

module.exports = router;