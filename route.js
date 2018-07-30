'use strict';

let express = require('express');
let router = express.Router();
let Question = require('./models').Question;


router.param("qID" ,(req ,res , next,id)=>{
    Question.findById(id, function(err , doc){
        if(err) return next(err);
        if (!doc){
            err = new Error("Not Found");
            err.status = 404; 
            return next(err);
        }
        req.question = doc ;
        return next();
    });
});
router.param("aID" ,(req ,res , next,id)=>{
    req.answer = req.question.answers.id(id);
    if (!req.answer){
        err = new Error("Not Found");
        err.status = 404; 
        return next(err);
    }
    next();
});
////////////////////
/// GET => /questions
///////////////////

//Route for question collection
router.get("/" , (req, res , next)=>{
    Question.find({})
            .sort({createdAt:-1} )
            .exec((err , questions)=>{
                if(err) return next(err);
                res.json(questions);
            })
});

////////////////////
/// POST => /questions
///////////////////

// Route for creating questions 
router.post("/" , (req, res)=>{
    var question =new Question(req.body);
    question.save((err,question)=>{
        if(err) return next(err);
        res.status(201);
        res.json(question);
    })
});

////////////////////
/// GET => /questions/:id
///////////////////

//Route for specific questions
router.get("/:qID" , (req, res)=>{   
        res.json(req.question);   
});

////////////////////
/// POST => /questions/:qID/answers
///////////////////

//Route for creating anwser
router.post("/:qID/answers" ,function(req, res ,next){
    req.question.answer.push(req.body);
    req.question.save((err,question)=>{
        if(err) return next(err);
        res.status(201);
        res.json(question);
    });
});

////////////////////
/// PUT => /questions/:qID/answers/:aID
///////////////////

//Edit a speicific answer
router.put("/:qID/answers/:aID" , (req, res)=>{
    req.answer.update(req.body ,function(err , result){
        if(err) return next(err);
        res.json(result);
    });
    res.json(
        { 
            response:"You sent me a PUT request to /answers",
            questionID :req.params.qID,
            answerID :req.params.aID,
            body:req.body
        });
});
////////////////////
/// DELETE => /questions/:qID/answers/:aID
///////////////////

//Delete a speicific answer
router.delete("/:qID/answers/:aID" , (req, res)=>{
    req.answer.remove(function(err){
        req.question.save(function(err , question){
            if(err) return next(err);
            res.json(question);
        })
    })
});

////////////////////
/// POST => /questions//:qID/answers/:aID/vote-up
/// POST => /questions//:qID/answers/:aID/vote-down
///////////////////

//Vote on a speicific answer
// Express 允許我們在後面接無數的 callback function ， 它會依照順序去執行 ，所我們要在第一個callback裡面
// 進行 :dir 參數的過濾，不讓除了 vote-up 或是 vote-down 的參數進來
router.post("/:qID/answers/:aID/vote-:dir" ,   
    (req, res , next)=>{
        if(req.params.dir.search(/^(up|down)$/) === -1 ){
            var err = new Error("Not Found");
            err.status = 404 ;
            next(err);
        }
        else{
            req.vote = req.params.dir ;
            next();
        }
    }
    ,
    (req, res , next)=>{
       req.answer.vote(req.vote , function(err, question){
            if(err) return next(err);
            res.json(question);
       })  
       
});


module.exports = router ;
