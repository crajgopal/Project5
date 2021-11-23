const express = require('express'); //import express package

const router = express.Router(); //Create instance of Router

const db = require('../database');
const bcrypt = require('bcryptjs');

const nodemailer = require('nodemailer');

const jwt = require('jsonwebtoken');
router.use(express.urlencoded({ extended: true })); //middleware to get req body.

const JWT_SECRET = process.env.JWTSECRET;

//Step1 for sending email:
//Making connection using transporter varaible
let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

const redirectHome = (req, res, next) => {
  if (req.session.userId) res.redirect('/ratings');
  else next();
};

router.get('/', redirectHome, (req, res) => {
  res.render('pages/index', {
    title: 'Movie DB app',
  });
});

router.get('/login', redirectHome, (req, res) => {
  res.render('pages/login', {
    title: 'Movie DB app',
  });
});

router.get('/movie', (req, res) => {
  res.render('pages/movie', {
    title: 'Movie DB app',
  });
});

router.post('/movie', (req, res) => {
  res.render('pages/movie', {
    title: 'Movie DB app',
  });
});

router.get('/new-user', redirectHome, (req, res) => {
  res.render('pages/new-user');
});

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

router.get('/forgot-password', redirectHome, (req, res) => {
  res.render('pages/forgot-password');
});

router.post('/forgot-password', redirectHome, (req, res) => {
  //make sure user exists
  const { email } = req.body;
  console.log('Email address is ' + email);
  db.any('SELECT * FROM users WHERE email=$1', [email])
    .then((user) => {
      console.log(user);

      // If users exists  then create one time link valid for 10 mins
      const secret = JWT_SECRET + user[0].password;
      //payload stored inside  JWT token
      const payload = {
        email: user[0].email,
        id: user[0].id,
      };

      const token = jwt.sign(payload, secret, { expiresIn: '10m' });
      //create link from token

      let link = `http://localhost:3000/reset-password/${user[0].id}/${token}`;

      console.log(link);

      //Step2 for sending  email:
      let mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Password reset for ' + `${user[0].firstname}`,
        text: link,
      };

      //step3 for sending email

      transporter.sendMail(mailOptions, function (err, data) {
        if (err) {
          console.log('Error Occurs', err);
        } else {
          console.log('Email sent!!!');
        }
      });

      const message = 'Password reset link is sent to your email :';
      res.render('pages/passresetmessage', { message, email });
    })
    .catch((error) => {
      let errors = [];
      errors.push({
        message: ' Email is not registered .Fill details to register',
      });
      res.render('pages/new-user', { errors });

      // res.redirect("/error?message=" + error.message)
    });
});

router.get('/reset-password/:id/:token', (req, res) => {
  const { id, token } = req.params;
  db.any('SELECT id ,email, password FROM users WHERE id =$1', [id])

    .then((user) => {
      if (parseInt(id) !== user[0].id) {
        res.send('Invalid id ..');
        return;
      } else {
        //if we have valid id and user
        const secret = JWT_SECRET + user[0].password;
        const payload = jwt.verify(token, secret);
        res.render('pages/reset-password', {
          email: user[0].email,
        });
      }
    })
    .catch((error) => {
      res.redirect('/error?message=' + error.message);
      //res.render('pages/forgot-password')
    });
});

router.post('/reset-password/:id/:token', (req, res) => {
  const { id, token } = req.params;
  const { password, password1 } = req.body;

  //check if the id exists
  db.any('SELECT id ,email, password FROM users WHERE id =$1', [id])

    .then((user) => {
      console.log(id);
      console.log(user[0].id);
      if (parseInt(id) !== user[0].id) {
        res.send('Invalid id ..');
        return;
      }
      const secret = JWT_SECRET + user[0].password;
      const payload = jwt.verify(token, secret);

      const email = user[0].email;
      let errors = [];
      if (!req.body) {
        errors.push({ message: 'Please enter all fields' });
      }
      if (password.length < 6) {
        errors.push({ message: 'Password should be atleast 6 characters' });
      }
      if (password != password1) {
        errors.push({ message: 'passwords do not match' });
      }

      if (errors.length > 0) {
        res.render('pages/reset-password', { errors, email: user[0].email });
      } else {
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        //find the user with payload email and id  and then update the password

        db.any('UPDATE users SET password = $1 WHERE id = $2 AND email =$3', [
          hashedPassword,
          parseInt(id),
          user[0].email,
        ])
          .then((user) => {
            const message = 'Password updated for user with email :';
            res.render('pages/passresetmessage', { message, email });
          })
          .catch((error) => {
            res.redirect('/error?message=' + error.message);
          });
      }
    })
    .catch((error) => {
      res.redirect('/error?message=' + error.message);
    });
});

module.exports = router;
