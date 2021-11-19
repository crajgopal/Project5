
require('dotenv').config();

const express= require('express')//import express package

const router = express.Router() //Create instance of Router

const db = require('../database')
const bcrypt= require('bcryptjs')


router.use(express.urlencoded({extended:true}))//middleware to get req body.


const redirectLogin=( req, res, next)=>{
  if(!req.session.userId)
      res.redirect('/')
  else 
    next()
  }

  const redirectHome=( req, res, next)=>{
    if(req.session.userId)
        res.redirect('/ratings')
    else 
      next()
    }

//Get all ratings 
router.get('/', redirectLogin, (req, res)=>{
    
    db.any("SELECT * FROM ratings;")
       .then((ratings) => {
        db.any('SELECT * FROM users;')
        .then((users)=>{
    
         res.render('pages/ratings' , {
            title:'Movie DB website',
            users,
            message: req.query.message
    
        });
     })
    
      .catch((error) =>{
    
        console.log(error)
        res.redirect("/error?message ="+ error.message)
      })
      
    
    })
    .catch((error) =>{
    
      console.log(error)
      res.redirect("/error?message ="+ error.message)
    })
    
    })
 



    router.post('/',(req, res)=>{
      console.log(req.session)        
        const {email, password} = req.body
        const cleanedEmail = email.toLowerCase().trim()
        let errors = []
        const salt = bcrypt.genSaltSync(10)
        const hashedPassword =bcrypt.hashSync(password,salt)
        
  //  does user exist?
  
   db.any('SELECT * FROM users WHERE email =$1',[cleanedEmail])
  
    .then((user)=>{
      if (!user) return res.send("Credentials are not correct")
  
       //  if so, is password correct?
    const checkPassword = bcrypt.compareSync(password, user[0].password)
    if (!checkPassword) return res.send("Credentials are not correct")
  
  
      
     //user is valid 
        if(user){
        req.session.userId =user[0].id
        console.log(req.session)
        res.redirect('/ratings')         
        }
        else {
            errors.push({message:"Invalid User"})
            console.log(errors[0].message)
            res.redirect('/')
         }
        
    
    })
    
        .catch((error)=>{
         
            console.log(error)
            
          //  res.redirect("/error?message=" + error.message)
          res.redirect('/new-user')         
    
       })
    })
           




//get newratings page 

  router.get('/newratings', redirectLogin, (req, res)=>{
    
    db.any("SELECT * FROM ratings;")
       .then((ratings) => {
        db.any('SELECT * FROM users;')
        .then((users)=>{
    
         res.render('pages/newratings' , {
            title:'Rating website',
            ratings,
            length:users.length,
            users,
            message: req.query.message
    
        });
     })
    
      .catch((error) =>{
    
        console.log(error)
        res.redirect("/error?message ="+ error.message)
      })
      
    
    })
    .catch((error) =>{
    
      console.log(error)
      res.redirect("/error?message ="+ error.message)
    })
    
    })
 





  
//create new ratings

router.post('/newratings',redirectLogin, (req, res)=>{
  const {user_id, movie_id,rating} =req.body
   

  //add ratings to db
  
  db.none('INSERT INTO ratings(user_id, movie_id, rating) VALUES($1, $2, $3);',[user_id, movie_id,rating])
  
  
  .then(() =>{

  res.redirect('/ratings?message=Post+successfully+added') })
  
  .catch((error)=>{
  
  console.log(error)
  
  res.redirect("/error?message=" + error.message)
  })
  })
  
   
//Post user ratings info 

router.post('/delratings',redirectLogin,(req, res)=>{
  const{user_id, movie_id,rating} = req.body


  const message ="Updated  ratings for user with id "+ user_id 
  const message1 = "You dont have persmission update others ratings"

if(parseInt(user_id)==req.session.userId){
  console.log(parseInt(user_id))
  console.log(req.session.userId)
  
  db.any('DELETE FROM ratings WHERE user_id = $1 AND movie_id = $2',[user_id,movie_id])
   .then((ratings)=>{
    console.log(message)

        res.redirect('/ratings/newratings')
    
      })
    
  .catch((error)=>{
    res.redirect("/error?message=" + error.message)

  })
}
else {
  res.redirect('/ratings/newratings')
}  
  


  
})




module.exports = router 