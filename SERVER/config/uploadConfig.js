
// const multer = require('multer');
// const cloudinary = require('cloudinary').v2;
// const { CloudinaryStorage } = require('multer-storage-cloudinary');
// const mongoose = require('mongoose'); 

// cloudinary.config({
//   cloud_name: 'dlrgv3nb4',
//   api_key: '924173917361624',
//   api_secret: 'g-LWaZ4kGbCgmCehC36iR-f6t9Q',
// });

// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: 'doctor_profiles', 
//     format: async (req, file) => 'png',  
//     public_id: (req, file) => Date.now() + '-' + file.originalname,
//   },
// });

// const upload = multer({ storage });

// module.exports = {
//   upload,
//   mongoose, 
// };
