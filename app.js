const express = require('express');
const chalk = require('chalk');
const morgan = require('morgan');
const debug = require('debug')('app');
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const path = require('path');
const mongoose = require('mongoose');
const port = 5000;
const MongoStore = require('connect-mongo')(session); 
const Post = require('./models/Post');
const Category = require('./models/Category')
const app = express();

//connect mongo
mongoose.connect('mongodb://localhost/feedtowin');
db = mongoose.connection;
db.on('error',console.log.bind(console,'connection error:'));
db.once('open', function(){
    console.log("opened")
})


app.use(morgan('tiny'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


app.use(cookieParser());
app.use(session({
    secret: 'feedtowin',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
        mongooseConnection: mongoose.connection,
        collection:'sessions'} ),
    cookie: {expires: 1000000}
}))

app.use((req, res, next) => {
	if(req.cookies.user_sid && !req.session.user)
		res.clearCookie('user_sid');
	 next();
});



// middleware function to check for logged-in users
var sessionChecker = (req, res, next) => {
    console.log("Here is session checker");
    if(req.cookies['connect.sid'])
        console.log("connect.id" +req.cookies['connect.sid'])
    //if(req.session.passport.user)
      //  console.log("session user" + req.session.passport.user);
    //console.log(req.session.user);
    //console.log(req.cookies.user_sid);
    if(req.session)
        console.log(req.session)
    if (req.session.hasOwnProperty('passport') && req.cookies['connect.sid']) {
        console.log(req.cookies.user_sid)
        console.log("Inside passed")
        res.redirect('/post');
    } else {
		res.locals.adminUser = 'notLoggedIn';
        next();
    }    
};
require('./config/passport')(app);
app.set('views', path.join(__dirname, '/source/views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, '/public/')));


//Routes
const adminRouter = require('./routes/adminRoutes')();
const postRouter = require('./routes/postRoutes')();
const viewPageRouter = require('./routes/viewPageRoutes')();


app.use('/admin',sessionChecker, adminRouter);
app.use('/post', postRouter);
app.use('/category', viewPageRouter);


function urlSlug(title){
    title = title.toLowerCase();
    return title.split(" ").join("-");
}

app.get('/',(req, res) =>{
    (async function query(){
        let arr = [];
        const posts = await Post.find({});
       // debug(posts);
        const categories = await Category.find({});
        //debug(categories)
        for(let i = 0; i < posts.length; i++){
            for(let j = 0; j < categories.length; j++){
                //Remember _id in mongo is object -> compare object not use == or ===
                if(posts[i].categoryId.toString() == categories[j]._id.toString()){
                    let cate = categories[j].name;
                    let {content, title, timeStamp} = posts[i];
                    let urlTitle = urlSlug(title);
                    console.log("Here is into loop")
                    console.log(cate)
                    console.log(content)
                    console.log(title)
                    arr.push({content, title, cate, timeStamp, urlTitle});
                }
            }
        }
        debug(arr);
        //let nav = ['dev', 'bullshit']; 
        res.render('index',{arr});
    }())
})

app.listen(port, ()=>{
    debug(`listening on port ${chalk.green(port)}`);
})