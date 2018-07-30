'use strict';

let mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/sandbox");

let db =mongoose.connection;

db.on("error" , (err)=>{
    console.error("connection error : " ,err);
});


db.once("open" , ()=>{
    console.log("DB conncetion succeseful");
    // All database communication goes here 

    let  Schema = mongoose.Schema;
    let AnimalSchema = new Schema({
        type :{ type: String ,   default:"goldfish" } ,
        size : String ,
        color:{ type: String ,   default: "golden"} ,
        mass :{ type: Number ,   default: 0.007} ,
        name :{ type: String ,   default:"Angela" } ,
    });
    AnimalSchema.pre("save" ,function(next){
        if(this.mass >= 100) {this.size ="big"}
        else if(this.mass >= 5 && this.mass <100) {this.size ="medium"}
        else {this.size ="small" ; }
        next();      
    });

    AnimalSchema.statics.findSize = function(size ,callback){
            //this == Animal
            return this.find({size:size} , callback)
    }

    let Animal = mongoose.model("Animal" , AnimalSchema ) ;
    let elephant = new Animal({
        type:"elephant",
        color:"gray",
        mass:6000,
        name:"Lawrence"
    });
    let animal = new Animal({}); // goldfish by default 
    let whale = new Animal({
        type:"whale",
        mass:190500,
        name:"Fig"

    })
    //////////////
        let animalData = [
            {
                type:"mouse",
                color:"gray" ,
                mass :0.036 ,
                name:"Marvin"
            },
            {
                type:"nutria",
                color:"brown" ,
                mass :6.35 ,
                name:"Gretchen"
            },
            {
                type:"wolf",
                color:"brown" ,
                mass :45 ,
                name:"Iris"
            },
            elephant,
            animal,
            whale
        ]
    /////////////
    Animal.remove({} , (err)=> {
            if(err)console.log(err);
            Animal.create( animalData ,(err ,animals) => {
                if(err)console.log(err); 
                Animal.findSize("medium" ,(err , animals)=>{
                        animals.forEach( animal =>console.log(`${animal.name} the ${animal.color} ${animal.type} is a ${animal.size}-sized animal ` ))
                        db.close(() => console.log("DB connecion cloesd !"));    
                    })
            })
                
         })      
 }) ;      
 
    /////////// 
