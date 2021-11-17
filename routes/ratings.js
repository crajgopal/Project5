
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

//Get all ratings 
router.get('/', redirectLogin, (req, res)=>{
    
    db.any("SELECT *, TO_CHAR(start_time,'HH12:MI AM')start_time ,TO_CHAR(end_time,'HH12:MI AM')end_time FROM schedules;")
       .then((schedules) => {
        db.any('SELECT * FROM users;')
        .then((users)=>{
    
         res.render('pages/ratings' , {
            title:'Schedule website',
            schedules,
            days,
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
           




//get newschedule page 

  router.get('/newratings', redirectLogin, (req, res)=>{
    
    db.any("SELECT *, TO_CHAR(start_time,'HH12:MI AM')start_time ,TO_CHAR(end_time,'HH12:MI AM')end_time FROM schedules;")
       .then((schedules) => {
        db.any('SELECT * FROM users;')
        .then((users)=>{
    
         res.render('pages/newratings' , {
            title:'Schedule website',
            schedules,
            days,
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
 





  
//create new schedule

router.post('/newratings',redirectLogin, (req, res)=>{
  const {user_id, day, start_time, end_time} =req.body
   

  //add schedules to db
  
  db.none('INSERT INTO schedules(user_id, day, start_time, end_time) VALUES($1, $2, $3, $4);',[user_id, day, start_time,end_time])
  
  
  .then(() =>{

  res.redirect('/ratings?message=Post+successfully+added') })
  
  .catch((error)=>{
  
  console.log(error)
  
  res.redirect("/error?message=" + error.message)
  })
  })
  
//User schedules and info

router.get('/userinfo',redirectLogin, (req, res)=>{
res.redirect('/ratings')

})
   
//Post user ratings info 

router.post('/userinfo',redirectLogin, (req, res)=>{
  
  const {user_id} = req.body

  db.any("SELECT *, TO_CHAR(start_time,'HH12:MI AM')start_time ,TO_CHAR(end_time,'HH12:MI AM')end_time FROM schedules WHERE user_id =$1 ",[user_id])
  .then((schedules)=>{

        db.any('SELECT * FROM users WHERE id =$1',[user_id])
  
    .then((users)=>{
      
 res.render('pages/userinfo',{
         
                    title:'Usersinfo',
                    id:user_id,
                    firstname:users[0].firstname,
                    surname:users[0].surname,
                    email:users[0].email, 
                    days,
                    schedules   
 
       })
      })

    })
  
    
    .catch((error)=>{
 
      console.log(error)
      
      res.redirect("/error?message=" + error.message)
          }) 
  
       .catch((error)=>{
 
        console.log(error)
        
        res.redirect("/error?message=" + error.message)
            })
  
  })



router.post('/delratings',redirectLogin,(req, res)=>{
  const{user_id, day} = req.body


  const message ="Updated d ratings for user with id "+ user_id 
  const message1 = "You dont have persmission update others ratings"

if(parseInt(user_id)==req.session.userId){
  console.log(parseInt(user_id))
  console.log(req.session.userId)
  
  db.any('DELETE FROM ratings WHERE user_id = $1 AND day = $2',[user_id,day])
  //db.any("SELECT *, TO_CHAR(start_time,'HH12:MI AM')start_time ,TO_CHAR(end_time,'HH12:MI AM')end_time FROM schedules WHERE user_id = $1 AND day = $2",[user_id,day])
   .then((schedules)=>{
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