var express = require('express');
var mongoose = require('mongoose');
var connectionString = process.env.OPENSHIFT_MONGODB_DB_URL || 'mongodb://localhost/test'
mongoose.connect(connectionString);

//Book Schema
var BookSchema = new mongoose.Schema({
    title: String,
    authors: [String],
    publisher: String,
    publishedDate: Date,
    ISBN10: String,
    ISBN13: String,
    language: String,
    pageCount: Number,
    description: String,
    img: String
});

//user Schema
var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    books: [BookSchema],
    followings: [String],
    followers: [String]
});
//Models
var UserModel = mongoose.model("UserModel", UserSchema);
var BookModel = mongoose.model("BookModel", BookSchema);


var app = express();
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var multer = require('multer');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(multer()); // for parsing multipart/form-data

app.use(session({ secret: 'this is the secret' }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

//public
app.use(express.static(__dirname + '/public'));


passport.use(new LocalStrategy(
function (username, password, done) {
    UserModel.findOne({ username: username, password: password }, function (err, user) {
        if (user) {
            return done(null, user);
        }
        return done(null, false, { message: 'Unable to login' });
        
    });

}));

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});



app.post("/login", passport.authenticate('local'), function (req, res) {
    //console.log("/login");
    //console.log(req.user);
    res.json(req.user);
});

app.post("/logout", function (req, res) {
    //console.log("/login");
    //console.log(req.user);
    req.logout();
    res.send(200);
});

app.get("/loggedin", function (req, res) {
    //console.log("/login");
    //console.log(req.user);
    res.send(req.isAuthenticated() ? req.user : '0');
});

//register new user
app.post("/register", function (req, res) {
    UserModel.findOne({$or: [{username: req.body.username}, {email: req.body.email}]}, function (err, user) {
        if (user) {
            res.json(null);
            return;
        }
        else {
            var newUser = new UserModel(req.body);
            newUser.save(function (err, user) {
                req.login(user, function (err) {
                    if (err) { return next(err); }
                    res.json(user);
                });

            });
        }

    });

});

//add new book to bookshelf
app.put("/AddtoBookshelf/:username", function (req, res) {
    var name = req.params.username;
    var book = {
        title: req.body.volumeInfo.title,
        authors: req.body.volumeInfo.authors,
        publisher: req.body.volumeInfo.publisher,
        publishedDate: req.body.volumeInfo.publishedDate,
        ISBN10: req.body.volumeInfo.industryIdentifiers[0].identifier,
        ISBN13: req.body.volumeInfo.industryIdentifiers[1].identifier,
        language: req.body.volumeInfo.language,
        pageCount: req.body.volumeInfo.pageCount,
        description: req.body.volumeInfo.description,
        img: req.body.volumeInfo.imageLinks.thumbnail
    }
    UserModel.findOne({ username: name }, function (err, user) {
                user.books.push(book);
                user.save();
    });
});

app.delete('/api/books/:username/:index', function (req, res) { 
    var name = req.params.username;
    var index = req.params.index;
    UserModel.findOne({ username: name }, function (err, user) {
        user.books.splice(index, 1);
        user.save();
        res.json(user);
    });
});

app.delete('/api/following/:username/:index', function (req, res) {
    var name = req.params.username;
    var index = req.params.index;
    UserModel.findOne({ username: name }, function (err, user) {
        user.followings.splice(index, 1);
        user.save();
        res.json(user);
    });
});

app.delete('/api/follower/:username/:index', function (req, res) {
    var name = req.params.username;
    var index = req.params.index;
    UserModel.findOne({ username: name }, function (err, user) {
        user.followers.splice(index, 1);
        user.save();
        res.json(user);
    });
});

app.post('/api/follow/:username/:person', function (req, res) {
    var name = req.params.username;
    var person = req.params.person;
    UserModel.findOne({ username: name }, function (err, user) {
        UserModel.findOne({ username: person }, function (err2, user2) {
            if (name == person) {
                res.json(user);
                return false;
            }
            if (user2) {
                user.followings.push(person);
                user.save();
                user2.followers.push(name);
                user2.save();
                res.json(user);
                return;
            }
            else {
                res.json(user);
                return false;
            }
        });
    });
});


//find by username
app.get('/api/users/:username', function (req, res) {
    var name = req.params.username;
    UserModel.findOne({ username: name }, function (err, doc) {
        res.json(doc);
    });
});


//fand all
app.get('/api/users', function (req, res) {
    UserModel.find(function(err,doc) {
        res.json(doc);
    });
});




var ip = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var port = process.env.OPENSHIFT_NODEJS_PORT || 3000;

app.listen(port, ip);