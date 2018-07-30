'use strict' ;

let express = require('express');
let app  = express();
let jsonParser = require('body-parser').json;
let routes = require('./route');
let logger = require('morgan');
let mongoose = require('mongoose');
//////////////////////////
/////  Function 
//////////////////////////



////////////////////////////////////////////////////
/////  Route 
////////////////////////////////////////////////////

app.use(logger("dev"));
app.use(jsonParser());

////////////////////////////////////// 
//////////  DataBase connection
////////////////////////////////////// 

mongoose.connect("mongodb://localhost:27017/qa");

let db =mongoose.connection;

db.on("error" , (err)=>{
    console.error("connection error : " ,err);
});


db.once("open" , ()=>{
    console.log("DB conncetion succeseful");
})
////////////////////////////////////// 

app.use("/questions" , routes);

// catch  404 and forward to error handler
app.use( (req ,res , next)=>{
    let err = new Error("Not Found");
    err.status = 404 ;
    next(err); 
});

// Error Handler 
// 注意！！ 這邊用四個參數來讓 express 知道這是一個 error handler 不是 middleWare
app.use( (err, req , res ,next) => {
    res.status(err.status || 500);
    res.json({
        error:{
            message:err.message
        }
    })
})


//   在route後面加 /:id  是req裡面的參數 => req.params.id
//   在route後面加 /?color=green  是req裡面的 => req.qurey.color

///////////////////
////   Port
///////////////////
let port = process.env.PORT || 3000;
app.listen(port , ()=>{
    console.log("server is running ....")
});