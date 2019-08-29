const express = require('express');
const exphbs  = require('express-handlebars');


const app= express();

//HandleBars Middleware
app.engine('handlebars', exphbs({
  defaultLayout:'main'
}));
app.set('view engine', 'handlebars');


//Index route

app.get('/', (req,res)=>{
  const title=' Welcome'
res.render('index',{
  title:title
})
})

//about route

app.get('/about', (req,res)=>{
  res.render('about')
  })
  





const port=5000;
app.listen(port,()=>{
  console.log(`Server Run on port ${port} !`)
})