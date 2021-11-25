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

  
//Get movies to rate 
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
           
router.get('/:id',(req, res)=>{

  res.render('pages/movieratings')
})

router.post('/:id',(req, res)=>{
  console.log(req.params.id)
  console.log(req.body.rating)
  console.log(req.session.userId)
  const movieid =parseInt(req.params.id)
  const userid= req.session.userId

if(typeof (req.body.rating) !='undefined'){
 db.one('INSERT INTO ratings(user_id, movie_id, rating) VALUES ($1,$2,$3) RETURNING movie_id, rating ;',[userid, movieid,req.body.rating])
 .then((data)=>{
   console.log(data)
    })

 .catch((error)=>{
  console.log(error)
  res.redirect("/error?message ="+ error.message) })

  db.any('SELECT rating FROM ratings WHERE movie_id =$1',[movieid])
  .then((ratings)=>{
        console.log(ratings)
        let sum =0 , avg=0;
         for (let i=0 ;i<ratings.length; i++){
          sum += ratings[i].rating
         }
         console.log(sum)
         avg =sum/ratings.length
         console.log(avg)
    res.render('pages/movieratings',{avg})
    })
   .catch((error)=>{
     res.redirect("/error?message ="+ error.message) 
      })


}


 else {
  res.render('pages/movieratings')

 }
})


//create new ratings

router.post('/movieratings',redirectLogin, (req, res)=>{
  const {user_id, movie_id,rating} =req.body
  console.log("In post moveratings")
  console.log(req.body)
  

  res.render('pages/movieratings')
  })
  
   

module.exports = router 