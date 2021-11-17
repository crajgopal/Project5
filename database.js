   //loading and initialising library

   require("dotenv").config()
   
   const pgp = require('pg-promise')()

 // const pgp = require('pg')
  // const isProduction =process.env.NODE_ENV ==='production'

   //connection string 
 const con = 'postgres://postgres:rajgopal@localhost:5432/project4'

 //  const con =  `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATEBASE}`
     //const db= pgp({ con:isProduction ? process.env.DB_DATEBASE_URL:con })
    
   //create new instance of database 
   const db = pgp(con)

   //exporting the database
   module.exports = db
