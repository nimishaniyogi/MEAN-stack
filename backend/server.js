var express = require('express')
var cors = require('cors')
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var jwt = require('jwt-simple')
var app = express()
var auth = require('./auth.js')
var Post = require('./models/Post.js')
var User = require('./models/User.js')
var multer = require('multer')
var crypto = require('crypto')
var mime = require('mime')
mongoose.Promise = Promise

app.use(cors())
app.use(bodyParser.json())


app.get('/posts/:id', async (req,res) => {
    var author = req.params.id
   var posts = await Post.find({author})
   res.send(posts)

})

app.post('/post',auth.checkAuthenticated, (req,res)=>{
var postData = req.body
postData.author = req.userId

    var post = new Post (postData)

    post.save((err, result) => {
        if (err){

            console.error('saving post error')
            return res.status(500).send({message: 'Saving post error'})
        }
        res.sendStatus(200)
     
    })
    
})

app.get('/users', async (req,res) => {
    try {
        
        var users = await User.find({}, '-pwd -__v')
        res.send(users)
    } catch (error) {
        console.error(error)
        res.sendStatus(500)
    }
})

app.get('/profile/:id', async (req,res) => {
    try {
        var user = await User.findById(req.params.id, '-pwd -__v')
        res.send(user)
    } catch (error) {
        console.error(error)
        res.sendStatus(500)
    }
})
// upload file 

app.post('/upload', function uploadAudio(req, res) {
    var tmpUploadsPath = './upload'
    var storage = multer.diskStorage({
      destination: tmpUploadsPath,
      filename: function (req, file, cb) {
        crypto.pseudoRandomBytes(16, function (err, raw) {
          cb(null, raw.toString('hex') + Date.now() + '.' + mime.getExtension(file.mimetype));
        });
      }
    });
    var upload = multer({
      storage: storage
    }).any();
  
    upload(req, res, function (err) {
      if (err) {
        console.log(err);
        return res.end('Error');
      } else {
        console.log(req.body);
        req.files.forEach(function (item) {
          console.log(item);
          // move your file to destination
        });
        res.end('File uploaded');
      }
    });
  });

// connect to mongoose <dbuser> should be replace by database name and dbpwd should be replace by database password.
mongoose.connect('mongodb://<dbuser>:<dbpwd>', (err) => {
    if(!err)
        console.log('connected to mongo')
})

app.use('/auth', auth.router)
app.listen(3000)