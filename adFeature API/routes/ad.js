var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var multer = require('multer'); 
var path = require('path');
var fs = require('fs');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

var length;

const dir = "./public/images";

var setName = ()=>{
    return fs.readdirSync(dir).length
}

var storage = multer.diskStorage({
    destination :(req, file, cb)=>{
        cb(null,'public/images');
    }, 
    filename:  (req, file, cb)=>{
        cb(null, 'img' + setName() + '.png');
    }
})

var imageFileFilter = (req, file, cb)=>{
    if(!file.originalname.match(/\.(jpg|jpeg|png|gif|PNG)$/)){
        return cb(new Error('Only Image file'), false);
    }
    return cb(null, true);
};

var upload = multer({storage: storage, fileFilter: imageFileFilter});

router.get('/',(req,res,next)=>{
    res.sendFile(path.join(__dirname, '../','upload.html'))
})

router.post('/delete',(req,res,next)=>{
    console.log(req.body.img + 'sakdasd');
    fs.unlink(path.join(__dirname, '../public/images',req.body.img),()=>{
        res.json({success:true});
        var names = fs.readdirSync(dir);
        for(var i=0; i<setName(); i++){
            file = names[i];
            fs.rename(path.join(__dirname, '../public/images',file) ,path.join(__dirname, '../public/images','img'+i+'.png') ,()=>{
                console.log('renamed');
            })
        }
    });
});


router.post('/', upload.single('imageFile'), (req, res, next)=>{
    res.statusCode = 200;
    res.setHeader('Content-type', 'application/json');
    res.json({file: req.file});
})

router.get('/imgNo',(req,res,next)=>{
    res.json({length:setName()});
});

router.get('/:img',(req,res,next)=>{
    res.sendFile(path.join(__dirname, '../public/images',req.params.img))
})


module.exports = router;