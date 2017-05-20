'use strict';

var _util = require('../util');

var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var User = require('../models/user');

var getFullURL = require('../util/get-full-url');
var passport = require('passport');

router.use(bodyParser.urlencoded({ extended: true }));
var requireAuth = passport.authenticate('jwt', { session: false });

// CREATES A NEW USER
router.post('/', requireAuth, function (req, res) {
    var email = req.body.email;
    var password = req.body.password;

    if (!email || !password) {
        return res.status(422).send({ error: 'You must provide email and password' });
    }

    // See if a user with the given email exists
    User.findOne({ email: email }, function (err, existingUser) {
        if (err) {
            return next(err);
        }

        // If a user with email does exist, return an error
        if (existingUser) {
            return res.status(422).send({ error: 'Email is in use' });
        }

        // If a user with email does NOT exist, create and save user record
        var user = new User({
            email: email,
            password: password
        });

        user.save(function (err) {
            if (err) {
                return next(err);
            }

            var newUser = Object.assign({}, user);
            newUser["id"] = user._id;
            res.status(200).send(newUser);
        });
    });
});

// RETURNS ALL THE USERS IN THE DATABASE
router.get('/', requireAuth, function (req, res) {
    req.checkQuery('_sort', 'Invalid _sort').isAscii();
    req.checkQuery('_order', 'Invalid _order').isAlpha();
    req.checkQuery('_start', 'Invalid _start').isInt();
    req.checkQuery('_end', 'Invalid _end').isInt();

    req.getValidationResult().then(function (result) {
        if (!result.isEmpty()) {
            res.set('Content-Type', 'application/json');
            res.status(500).send(JSON.stringify((0, _util.removeDuplicates)(result.array(), 'param')));
        }

        var sort_field = req.query._sort || "_id";
        var sort_order = req.query._order === 'DESC' ? -1 : 1;

        var sort_obj = {};
        sort_obj[sort_field] = sort_order;

        var options = {
            select: '_id email password',
            sort: sort_obj,
            offset: +req.query._start,
            limit: req.query._end - req.query._start
        };

        User.paginate({}, options).then(function (result) {
            var newDocs = result.docs.map(function (el) {
                var rObj = Object.assign({}, el._doc);
                rObj["id"] = el._id;
                delete rObj._id;
                return rObj;
            });
            res.setHeader('X-Total-Count', result.total);
            res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');
            res.status(200).send(newDocs);
        }).catch(function (err) {
            res.status(500).send(err);
        });
    });
});

// GETS A SINGLE USER FROM THE DATABASE
router.get('/:id', requireAuth, function (req, res) {
    User.findById(req.params.id, function (err, user) {
        if (err) return res.status(500).send("There was a problem finding the user.");
        if (!user) return res.status(404).send("No user found.");
        res.status(200).send(user);
    });
});

// DELETES A USER FROM THE DATABASE
router.delete('/:id', requireAuth, function (req, res) {
    User.findByIdAndRemove(req.params.id, function (err, user) {
        if (err) return res.status(500).send("There was a problem deleting the user.");
        res.status(200).send("User: " + user.email + " was deleted.");
    });
});

// UPDATES A SINGLE USER IN THE DATABASE
router.put('/:id', requireAuth, function (req, res) {
    User.findByIdAndUpdate(req.params.id, req.body, { new: true }, function (err, user) {
        if (err) return res.status(500).send("There was a problem updating the user.");
        res.status(200).send(user);
    });
});

module.exports = router;
//# sourceMappingURL=UserController.js.map