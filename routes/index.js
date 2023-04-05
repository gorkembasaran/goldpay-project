var express = require('express');
const req = require('express/lib/request');
var router = express.Router();
const db = client.db('kullanici-hesaplari');
const quotesCollection = db.collection('kullanici');

router.get('/', function(req,res,next){
    res.render('index', {title:'Express'});
});

router.get('/dashboard', function(req,res){
    if (req.session.isLoggedIn){
        res.render('dashboard', {user: req.session.id});
        return;
    }
    res.redirect('/no-yet');
});

router.get('/no-yet', function(req, res){
    res.render('no-yet');
});

router.get('/login', function(req,res,next) {
    res.render('login', {error: null});
});

router.post('/submit/login', function(req,res, next){
    var username = req.body.id;
    var password = req.body.password;

    if (username === db.id && password === db.password){
        req.session.isLoggedIn = true;
        req.session.id = db;
        res.redirect('/dashboard');
    } else {
        res.render('login', {error: 'Id or password is incorrect'})
    }
})

router.get('/submit/logout', function(req, res, next){
    req.session.isLoggedIn = false;
    req.session.id = undefined;
    res.redirect('/login'); 
})

module.exports = router;