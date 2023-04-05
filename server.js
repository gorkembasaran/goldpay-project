
// web uygulama frameworku
const express = require('express');
// http req body erişim sağlamaya yara, req.body gibi
const bodyParser = require('body-parser');
// veritabanı, kayıtlara erişim
const MongoClient = require('mongodb').MongoClient;
const session = require('express-session');
const createError = require('http-errors');
const cookieParser = require('cookie-parser');

var logger = require('morgan')
var indexRouter = require('./routes/index')
var usersRouter = require('/routes/users')

const app = express();
const uri = "mongodb+srv://savehkei:gorkem243@cluster0.odl74.mongodb.net/?retryWrites=true&w=majority";

MongoClient.connect(uri, { useUnifiedTopology: true })
    .then(client => {
        console.log('Connected to Database')
        const db = client.db('kullanici-hesaplari')
        const quotesCollection = db.collection('kullanici')
        app.use(bodyParser.urlencoded({ extended: true}))
        app.use(express.static('public'))
        app.use(session({
            secret: 'secret'
        }));
        app.use(logger('dev'));
        app.use(express.json());
        app.use(express.urlencoded({extended: false}));
        app.use(cookieParser());
        app.use(express.static(path.join(__dirname, 'public')));
        app.use('/', indexRouter);
        app.use('/users', usersRouter);
        
        app.use(function(req,res,next) {
            next(createError(404));
        })

        app.use(function(err, req, res, next){
            res.locals.message = err.message;
            res.locals.error = req.app.get('env') === 'development' ? err : {};

            res.status(err.status || 500);
            res.render('error');
        })

        app.listen(5000,function(){
            console.log('Listening on 5000')
        })

        app.get('/',(req,res) =>{
            const cursor = db.collection('kullanici').find()
            db.collection('kullanici').find().toArray()
            .then(results => {
                console.log(results)
            })
            .catch(error => console.error(error))
            console.log(cursor)
            res.render('index.ejs',{})
        })
        app.set('views', path.join(__dirname, 'view'));
        app.set ('view engine', 'ejs');

        app.post('/kullanici', (req,res) => {
            quotesCollection.insertOne(req.body)
                .then(result => {
                    res.redirect('/')
                })
                .catch(error => console.error(error))
        })

        app.get('/boyle-bir-kullanici-yok', (req, res) => {
            res.render('no-user');
        })

        app.post('/giris', (req, res) => {
            var receivedEmail = req.body.mail;
            var receivedPassword = req.body.password;

            quotesCollection.findOne({ mail: receivedEmail, password: receivedPassword })
                .then(result => {
                    if (result) {
                        res.render('welcome', { name: result.name });
                    }
                    else res.redirect('/boyle-bir-kullanici-yok');
                })
                .catch(error => console.error(error))
        })
    })
    .catch(error => console.error(error))
    module.exports = app;
