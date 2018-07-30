'use strict';

let mongoose = require('mongoose');

let Schema = mongoose.Schema;
let sortAnwsers = function(a , b){
    //- negative a before b
    //0  no change
    // + positive a after b
    if(a.votes === b.votes){
        return b.updatedAt  - a.updatedAt ;
    }
    return b.votes - a.votes ;
}

let AnswerSchema = new Schema({
    text:String,
    createdAt:{type:Date , default:Date.now},
    updatedAt:{type:Date , default:Date.now},
    votes:{type:Number , default:0}
});

AnswerSchema.method("update",function(update , callback){
    Object.assign(this , updates ,{updatedAt:new Date()});
    this.parent().save(callback);
});

AnswerSchema.method("vote",function(vote , callback){
    if(vote === "up"){
        this.votes += 1;
    }else{
        this.votes -= 1;
    }
    this.parent().save(callback);
});

let QusetionSchema = new Schema({
    text:String,
    createdAt:{type:Date , default:Date.now},
    answers:[AnswerSchema]
});
QusetionSchema.pre("save" , function(next){
    this.answers.sort(sortAnwsers); // [object , object]
    next();
})
let Question = mongoose.model("Question" , QusetionSchema);

module.exports.Question = Question ;