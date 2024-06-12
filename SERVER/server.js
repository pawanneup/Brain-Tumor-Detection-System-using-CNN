const express = require("express");
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const dbConfig = require("./config/dbConfig");
const jwt = require('jsonwebtoken'); 
const unless = require('express-unless'); 
app.use(express.json());
const userRoute= require("./routes/userRoute");
const adminRoute = require("./routes/adminRoute")
const doctorsRoute = require("./routes/doctorsRoute")
app.use('/api/user', userRoute);
app.use('/api/admin',adminRoute);
app.use('/api/doctor',doctorsRoute);

const port = process.env.PORT || 5000;



const jwtMiddleware = (req, res, next) => {
    
    const excludePaths = [
        '/api/user/login',
        '/api/user/register',
        '/api/admin/login'
    ];

   
    if (excludePaths.includes(req.path)) {
       
        return next();
    }

   
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];

  
    if (!token) {
      
        return res.status(401).json({ message: 'Unauthorized' });
    }

    
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            
            return res.status(401).json({ message: 'Unauthorized' });
        }

       
        req.userId = decoded.id;

      
        next();
    });
};


jwtMiddleware.unless = unless;


app.use(jwtMiddleware);

app.listen(port, '0.0.0.0',() => console.log(`Listening on port ${port}`));

// const express = require("express");
// const app = express();
// const dotenv = require('dotenv')
// dotenv.config()
// const dbConfig = require("./config/dbConfig");
// const unless = require('express-unless');
// app.use(express.json());
// const userRoute= require("./routes/userRoute");
// app.use('/api/user',userRoute);

// const port = process.env.PORT || 5000;

// const jwtMiddleware = unless({
//     path: [
//       '/api/user/login',
//       '/api/user/register',
//       '/api/admin/login'
//     ]
//   });
  
// app.use(jwtMiddleware);
// app.listen(port, () => console.log(`Listening on port ${port}`));

// const express = require("express");
// const app = express();
// const dotenv = require('dotenv')
// dotenv.config()
// const dbConfig = require("./config/dbConfig");
// app.use(express.json());
// const userRoute= require("./routes/userRoute");
// app.use('/api/user',userRoute);

// const port = process.env.PORT || 5000;
// // console.log(process.env.MONGO_URL)

// // app.use(jwtMiddleware.unless({
// //     path: [
// //         '/api/user/login',
// //         '/api/user/register',
// //         '/api/admin/login'
// //     ]
// // }));
// const jwtMiddleware = {
//     path: [
//       '/api/user/login',
//       '/api/user/register',
//       '/api/admin/login'
//     ]
//   };
  
// app.use(jwtMiddleware(jwtMiddleware));
// app.listen(port, () => console.log(`Listening on port ${port}`));
