const express = require("express");
const bodyPaser = require("body-parser");
const mongoose = require('mongoose');
const { name } = require("ejs");

const app = express();

app.use(express.static('public'));
app.use(bodyPaser.urlencoded({extended:true}));

app.set('view engine', 'ejs');

mongoose.connect('mongodb+srv://admin-adesh:adesh123@cluster0.n3keuxk.mongodb.net/expenseDB', { useNewUrlParser:true });

const expenseSchema = new mongoose.Schema ({
    note: String,
    cost : Number
})

const Expense = mongoose.model("Expense",expenseSchema);

//variable
var sum=0;

//home page reload section
app.get("/", function(req,res){
    const list = [];
    Expense.find({}, function (err, docs) {
        if (err){
            console.log(err);
        }
        else{
            //console.log("First function call : ", docs);
            for (let i in docs){
                //console.log(docs[i].note);
                list.push(docs[i]);
            }
            // console.log(notelist);
            res.render('index',{lists:list, sum:sum});
        }   
    });
})

//post request To add new item
app.post("/",function(req,res){
    const notevar = req.body.note;
    const costvar = req.body.cost;
    // console.log(notevar);
    // console.log(costvar);
    var ex = new Expense ({
        note: notevar,
        cost: costvar
    })
    ex.save();
    res.redirect("/");
})

//post request to delete a item
app.post("/test-button",function(req,res){
    let id = req.body.ID;
    //console.log(id);
    Expense.findOneAndDelete({_id:id}, function (err, docs) {
        if (err){
            console.log(err)
        }
        else{
            //console.log("Deleted User : ",docs);
            res.redirect("/");
        }
    });
    
    
})

//post request for calculate
app.post("/calculate",function(req,res){
        sum = 0;
    Expense.find(function(err,values){
        if(err){
            console.log(err)
        }
        else{
            //console.log("value came: "+ values);
            for(let x in values){
                sum+=values[x].cost;
                //console.log(values[x].cost);
            }
            res.redirect("/")
        }
    })
});

//server listening to port 3000
app.listen(3000,function(){
    console.log("server is listening to port 3000");
})