const express = require('express');
const exphbs  = require('express-handlebars');
const connectDB= require('./config/db');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash= require('connect-flash');
const session=require('express-session');
const mongoose = require('mongoose');


const app= express();

//---------------------//

  //mongoDB
  connectDB();

  //Load Idea Model

  require('./models/Idea');
  const Idea=mongoose.model('ideas')
  
//------------------------//


//HandleBars Middleware
app.engine('handlebars', exphbs({
  defaultLayout:'main'
}));
app.set('view engine', 'handlebars');

//middleware bodyParser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

//express-seesion midleware
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

//flash midleware
app.use(flash());


//Global var
app.use(function(req,res,next){
res.locals.success_msg= req.flash('success_msg');
res.locals.error_msg= req.flash('error_msg');
res.locals.error= req.flash('error');

next();
});

// override with POST having ?_method=DELETE
app.use(methodOverride('_method'));

//Index route

app.get('/', (req,res)=>{
  const title=' Welcome'
res.render('index',{
  title:title
})
})
//----------------------//

//about route

app.get('/about', (req,res)=>{
  res.render('about')
  });


  //Idea index page
  app.get('/ideas' , (req,res)=>{
    Idea.find({})
   .sort({date:'desc'})
    .then(ideas =>{
      res.render('ideas/index',{
        ideas:ideas
      })
    });
  });


//edit idea form

app.get('/ideas/edit/:id', (req,res)=>{
  Idea.findOne({
    _id:req.params.id
  })
  .then(idea =>{
    res.render('ideas/edit',{
      idea:idea
    })
  })
  
  });



//Add Idea form

app.get('/ideas/add', (req,res)=>{
  res.render('ideas/add')
  });

  //add/ process form

  app.post('/ideas',(req,res)=>{
    let errors=[];

    if(!req.body.title){
      errors.push({text:'Please add a title'});
    }
    if(!req.body.details){
      errors.push({text:'Please add a details'});
    }
    if(errors.length>0){
      res.render('ideas/add',{
        errors:errors,
        title:req.body.title,
        details:req.body.details
      });
    }else{
      const newUser = {
        title:req.body.title,
        details:req.body.details

      }
      new Idea(newUser)
      .save()
      .then(idea =>{
        req.flash("success_msg", "Idea added")
        res.redirect('/ideas');
      })
    }
  });


  //edit form process

  app.put('/ideas/:id',(req,res)=>{
   Idea.findOne({
     _id:req.params.id
   })
   .then(idea => {
     idea.title= req.body.title;
     idea.details=req.body.details;

     idea.save()
     .then(idea =>{
      req.flash("success_msg", "Idea updated")
       res.redirect('/ideas')
     })
   });
  });

  //delete idea process

  app.delete('/ideas/:id',(req,res) =>{
     Idea.deleteOne({_id:req.params.id})
     .then(() =>{
       req.flash("success_msg", "Idea remove")
       res.redirect('/ideas')
     })
  });






  //-------------//

const PORT= process.env.PORT || 5000;
app.listen(PORT,()=>{
  console.log(`Server Run on port ${PORT} !`)
})