const express = require('express');

const app = express();
const mongoose = require('mongoose');

const bodyParser = require('body-parser');

const jwt = require('jsonwebtoken')

const path = require('path')

const User = require('./models/userModel')

const routes = require('./routes/route.js')



// dotenv configuration

require("dotenv").config({
    path:path.join(__dirname,"../.env")
})




const PORT = process.env.PORT || 3000


// mongoose/mongodb database configuration


mongoose
.connect('mongodb://localhost:27017/tech-jobs-admin',{ useUnifiedTopology: true,useNewUrlParser: true 
 })
.then(()=>{
    console.log('Connected to the database successfully')
})


app.use(bodyParser.urlencoded({extended:true}));

app.use(bodyParser.json());





// app.use(async (req, res, next) => {
//     if (req.headers["x-access-token"]) {
//      const accessToken = req.headers["x-access-token"];
//      const { userId, exp } = await jwt.verify(accessToken, process.env.JWT_SECRET);
//      // Check if token has expired
//      if (exp < Date.now().valueOf() / 1000) {
//       return res.status(401).json({
//        error: "JWT token has expired, please login to obtain a new one"
//       });
//      }
//      res.locals.loggedInUser = await User.findById(userId);
//      next();
//     } else {
//      next();
//     }
// });

app.use('/',routes);

app.listen(PORT,()=>{
    console.log(`Server is listening on port ${PORT}`)
})