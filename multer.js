// import multer from 'multer';
// import path from 'path';
// //import ApiError from '../helpers/ApiError';
// import mkdirp from 'mkdirp';

let multer = require('multer');
let path = require('path')
let mkdirp = require('mkdirp')


// const fileFilter = (req, file, cb) => {
//     if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
//         cb(null, true);
//     } else cb(new ApiError.UnprocessableEntity('jpeg or png are the only accepted types'));
// }

//module.export = 
function multerSaveTo(folderName) {

    let storage = multer.diskStorage({
        destination: function (req, file, cb) {
            console.log("BODY iN DEST : ", req.body);
            let dest = `node-crud/uploads/${folderName}`;
            // create destination if don't exist
            mkdirp(dest, function (err) {
                if (err)
                    //return cb(new ApiError(500, "Couldn't create dest"))
                    console.log(err)
                cb(null, dest)
            });
        },
        filename: function (req, file, cb) {
            cb(null, `${file.fieldname}-${Date.now() + Math.floor(Math.random() * 10000) + path.extname(file.originalname)}`);
        }
    });

    return multer({
        storage,
        //    fileFilter,
        limits: {
            fileSize: 1024 * 1024 * 25 // limit 10mb
        }
    });;

}

module.exports = {
    multerSaveTo
}