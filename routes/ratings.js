
require('dotenv').config();

const express= require('express')//import express package

const router = express.Router() //Create instance of Router

const db = require('../database')
const bcrypt= require('bcryptjs')

const days =['Monday','Tuesday','Wednesday','Thursday', 'Friday', 'Saturday' , 'Sunday']

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

//Get all ratings to do 
router.get('/', redirectLogin, (req, res)=>{
    
    db.any("SELECT *  FROM ratings;")
       .then((ratings) => {
        db.any('SELECT * FROM users;')
        .then((users)=>{
    
         res.render('pages/ratings' , {
         //to do 
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
           




//get newratings page  to do if user wants to update ratings 

  router.get('/newratings', redirectLogin, (req, res)=>{
    


    
    })
 





  
//create new ratings

   
//Post user ratings info 

router.post('/userinfo',redirectLogin, (req, res)=>{
  
  
  })






module.exports = router 