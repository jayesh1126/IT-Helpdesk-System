const express = require('express')
const session = require('express-session');
const router = express.Router()
const mysql = require('mysql')
var crypto = require('crypto');
var sess;

const pool  = mysql.createPool({
    connectionLimit : 10,
    host            : 'localhost',
    user            : 'teamb006',
    password        : 'c0gjyXj0ZS',
    database        : 'teamb006'
})


router.get('/', function(req, res, next){
  req.session.destroy((err) => {
    if(err) {
        return console.log(err);
    }
    res.render('login');
  });
  
  
});



router.post('/', function(req, res){
  sess = req.session;
  var username = req.body.username;
  var password = req.body.password;

  var hashedPassword = crypto.createHash('md5').update(password).digest('hex');
  console.log(hashedPassword)

  pool.getConnection((err, connection) => {
    if(err) throw err
    console.log('connected as id ' + connection.threadId)
    connection.query('SELECT * FROM Personnel LEFT JOIN Specialist ON Personnel.ID = Specialist.PersonID where username="'+username+'" and PasswordHash="'+hashedPassword+'"  UNION SELECT * FROM Personnel RIGHT JOIN Specialist ON Personnel.ID = Specialist.PersonID where username="'+username+'" and PasswordHash="'+hashedPassword+'"', (err, rows) => {
         // return the connection to pool
        
        if (!err) {
            if (rows.length!=0){
              sess.username=username
              console.log(rows[0])
              sess.name=rows[0]["FullName"]
              sess.uid = rows[0]["ID"]
              if (rows[0]["SpecialtyID"]!=null){
                sess.type=1
              }
              else if(rows[0]["Externality"]!=0 && rows[0]["Externality"]!=null){
                sess.type=2
              }
              else{
                sess.type=0
              }
              if(rows[0]["Admin"]!=0 &&  rows[0]["Admin"]!=null){
                sess.type=3
              }
              
              
              res.redirect('users')
            }
            else{

              res.redirect('login')
            }

        } else {
            res.redirect('login')
        }


    })
    connection.release()
  })

});



module.exports = router
