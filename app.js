var express = require('express');
var path = require('path');
var User = require('./models/users');
var favicon = require('serve-favicon');
var logger = require('morgan');
const crypto = require('crypto');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
const dbconnection = require('./config/config');
var session = require('express-session');
var passwordHash = require('password-hash');
var isLoggedIn = require('./middlwares').isLoggedIn;
const multer = require('multer');
const { multerSaveTo } = require('./multer');
var fs = require('fs');
const mime = require('mime');
let Grid = require("gridfs-stream");
var cloudinary = require('cloudinary');
var nodeMailer = require('nodemailer');
let mongo = mongoose.mongo;
let gfs;
const imageUrl = require('./utils/index');




//mongoose.Promise = global.Promise;

//calling here my function !! to connect mlab database online for mongo look at config file :)
 dbconnection();

//#region Useage



//this is for mongodb connection if you don't wanna connect to mlab :) this is local db.
/************************************************************/
//mongoose.connect('mongodb://localhost/Market')
//.then(() =>  console.log('connection succesful'))
//.catch((err) => console.error(err));


// var index = require('./routes/index');
// var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/')
  },
  filename: function (req, file, cb) {
    crypto.pseudoRandomBytes(16, function (err, raw) {
      cb(null,raw.toString('hex') + Date.now() + '.' + mime.getExtension(file.mimetype));
    });//
  }
});



const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
var upload = multer({ storage: storage ,fileFilter: fileFilter });
// const upload = multer({
//   storage: storage,
//   // limits: {
//   //   fileSize: 1024 * 1024 * 5
//   // },
//   // fileFilter: fileFilter
// });


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));

app.use(session({
  secret: 'Marketing',
  resave: false,
  saveUninitialized: true
}));


//app.use('/',in);
// app.use('/users', users);

//#endregion


//Get the Home page 
/**************************************************************************** */
app.get('/', async function (req, res) {
 
  
  res.render('user/register',{});
});







//#region New user
/*************************************************************************** */

/*create new user */
//New User Here Registeration 
app.get('/signup',async (req,res,next)=>{
  try {
    res.render('user/signup',{});
    
  } catch (error) {
    console.log(error)
    
  }

});
app.post('/signup', async (req, res, next) => {
  try {
    let newDoc = await User.user.create(req.body);
    req.session.loggedUser = newDoc;

     let transporter = nodeMailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
          user: 'ameeltogarymails@gmail.com',
          pass: 'run123mails0nl!n3'
      }
  });
  let mailOptions = {
      from: '"Hajj Easily" <ameeltogarymails@gmail.com>', // sender address
      to: req.body.email, // list of receivers
      subject: 'Welcome Haj '+ req.body.name, // Subject line
      html: '<b>Hajj Easily the best site to know how to deal with your flight, hotels,transport,and places</b> <p> انت الان مشترك على نظام موقعنا حج بسهولة الان سيأتيك رساله بكود للمعلومات عنك احتفظ به كلى نساعدك عند وصلولك للمملكة السعودية بالاحتياجات اللازمة مثل التنقلات و الاماكن الاتواصل </p>' // html body
  };

  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log('Message %s sent: %s', info.messageId, info.response);
          
      });
    res.status(201).json({message:'welcome'});
  } catch (err) {
    console.log(err)
    res.render('error',{error:err,message:'خطأ في عمليه التسجيل يرجي اعادة المحاولة'});
  }
});
//#endregion

//#region login
app.route('/login').get( async function (req, res) {
  let cat = await User.cats.find();
  let person = await User.catitem.find({cat:"11"});
  let product = await User.catitem.find({cat:"12"});
  let places = await User.catitem.find({cat:"13"});
  let catitem = await User.catitem.find();
  let adv = await User.adv.find();
  res.render('user/register', { title: 'Login', error: '', user: '', cats:cat , catitem:catitem , adv:adv ,per:person,pro:product,pla:places});
}).post(function (req, res) {
  // get from db 
  User.user.findOne({ username: req.body.usernamel }, function (err, user) {
    if (err) {
      console.log("Not found");
      res.render('error',{error:err,message:'خطأ في عمليه الدخول يرجي اعادة المحاولة'});
      //throw err;
    }

    if (user) {
      if (req.body.passwordl == user.password) {
      
        console.log("From if password matched");
        req.session.loggedUser = user;
        if(user.state=="active")
        {
          res.redirect('/home');
        }
        else if(user.state=="admin")
        {
          res.redirect('/admin');
        }
        else{
          res.redirect('/register');
        }
        
      }
      else {
        console.log("else 1");
        res.redirect('/register');

      }
    }
    else {
      console.log("else 2 ");
      res.render('user/register', { title: 'Login', error: "username error", user: req.body , cats:cat , catitem:catitem , adv:adv ,per:person,pro:product,pla:places });

    }
  });
});

app.use(isLoggedIn);




app.get('/home', isLoggedIn, async(req, res) => {

  res.render('user/home', { title: 'home',error:'', user: req.session.loggedUser ,adv:adv,city:city, per:person , pro:product , pla:places });
});

//End of login 


//#endregion


//#region Advertasment
//Add Adv :D 

/**************************************************************** */
//create new Adv 
var cpUpload = upload.fields([{ name: 'image', maxCount: 1 }, { name: 'images', maxCount: 4 }])
app.post('/home',cpUpload,async (req, res) => {
  try {
    

    
  if(!req.files['image'][0])
  {
    console.log("u didn't have any image");
    let err = "ادخل الصورة";
  }
  else{

    req.body.image = await imageUrl.toImgUrl(req.files['image'][0]);
  }

  if(req.files['images'])
  {
   let len = req.files['images'].length;
   console.log(len);
   req.body.images=[];
   for(let i=0;i<len;i++)
   {
     req.body.images.push(await imageUrl.toImgUrl(req.files['images'][i]));
   }
      // req.body.images=[req.files['images'][0].filename,
      // req.files['images'][1].filename,
      // req.files['images'][2].filename,
      // req.files['images'][3].filename];
  
  
  }
  else{
    console.log("you have to upload images");
    let err = "ادخل صور الاعلان الاخرى";
    
  }
   
    req.body.user = req.session.loggedUser;
    let newDoc = await User.adv.create(req.body);
    

      
    
    
    res.redirect('/home');
  } 
  catch (err) {
    console.log(err)
    res.render('error',{error:err,message:'خطأ في عمليه رفع الاعلان يرجي اعادة المحاولة'});
  }
});

//#endregion









//#region Error Handeler
/************************************************************************/



//Handel errors 

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
// app.listen(process.env.PORT || 8888, () => {
//   console.log("server is running....");

  
// });
//#endregion
module.exports = app;
