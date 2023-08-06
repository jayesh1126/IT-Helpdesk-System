const express = require('express')
const session = require('express-session');
const router = express.Router()
var mysql = require('mysql');
const { NULL } = require('mysql/lib/protocol/constants/types');

const pool  = mysql.createPool({
  connectionLimit : 10,
  host            : 'localhost',
  user            : 'teamb006',
  password        : 'c0gjyXj0ZS',
  database        : 'teamb006',
  multipleStatements: true
})

const app = express();
app.use(session({secret: 'usernames',saveUninitialized: true,resave: true}));

router.get('/', (req, res) =>{
    sess = req.session;
    if (sess.type>0){
        pool.getConnection((err, connection) => {
            sess = req.session;
            if(err) throw err
            console.log('connected as id ' + connection.threadId)
            // Get tickets
            connection.query('SELECT * from Tickets;SELECT * from ProblemType;SELECT * from Personnel;SELECT * from Specialist;SELECT * from Software;SELECT * from Hardware;', (err, rows) => {
                connection.release() // return the connection to pool

                if (!err) {
                    if (sess.type == 0){
                        res.redirect("users")
                    }
                    res.render("ticket",{queries : rows,username:sess.username})
                } else {
                    console.log(err)
                }
            })
        })  
    }
    else{
        res.redirect("login")
    }
})

router.post('/', (req, res) =>{

  pool.getConnection((err, connection) => {
    sess = req.session;
      if(err) throw err
      console.log('connected as id ' + connection.threadId)
      // Get tickets
      console.log(req.body);
      connection.query('SELECT * from Tickets;SELECT * from ProblemType;SELECT * from Personnel;SELECT * from Specialist;SELECT * from Software;SELECT * from Hardware;', (err, rows) => {
          connection.release() // return the connection to pool

          if (!err) {
              res.render("ticket",{queries : rows,username:sess.username})
          } else {
              console.log(err)
          }
      })
  })  
})

router.post('/onDragOver', (req, res) =>{

    pool.getConnection((err, connection) => {
        sess = req.session;
        if(err) throw err
        console.log('connected as id ' + connection.threadId)
        // Get tickets
        console.log(req.body);
        connection.query('SELECT * from Tickets;SELECT * from ProblemType;SELECT * from Personnel;SELECT * from Specialist;SELECT * from Software;SELECT * from Hardware;', (err, rows) => {
            connection.release() // return the connection to pool
  
            if (!err) {
                res.render("ticket",{queries : rows,username:sess.username})
            } else {
                console.log(err)
            }
        })
    })  
  })

  router.post('/updateType', (req, res) =>{

    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log('connected as id ' + connection.threadId)
        // Get tickets
        console.log(req.body);
        connection.query("Update Tickets SET TypeID ="+req.body.TypeID + " WHERE ID ="
        + req.body.ID + ";", (err, rows) => {
            connection.release() // return the connection to pool
  
            if (!err) {
                res.redirect(req.get('referer'));
            } else {
                console.log(err)
            }
        })
    })  
  })

  router.post('/updateState', (req, res) =>{

    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log('connected as id ' + connection.threadId)
        // Get tickets
        console.log(req.body);
        connection.query("Update Tickets SET TicketState = '"+req.body.TicketState + "' WHERE ID ="
        + req.body.ID + ";", (err, rows) => {
            connection.release() // return the connection to pool
  
            if (!err) {
                res.redirect(req.get('referer'));
            } else {
                console.log(err)
            }
        })
    })  
  })

  router.post('/removeResolvedDate', (req, res) =>{

    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log('connected as id ' + connection.threadId)
        // Get tickets
        console.log(req.body);
        connection.query("Update Tickets SET ResolvedTimestamp = NULL WHERE ID ="
        + req.body.ID + ";", (err, rows) => {
            connection.release() // return the connection to pool
  
            if (!err) {
                res.redirect(req.get('referer'));
            } else {
                console.log(err)
            }
        })
    })  
  })

  router.post('/setResolvedDate', (req, res) =>{

    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log('connected as id ' + connection.threadId)
        // Get tickets
        console.log(req.body);
        connection.query("Update Tickets SET ResolvedTimestamp = CURRENT_TIMESTAMP WHERE ID ="
        + req.body.ID + ";", (err, rows) => {
            connection.release() // return the connection to pool
  
            if (!err) {
                res.redirect(req.get('referer'));
            } else {
                console.log(err)
            }
        })
    })  
  })

  router.post('/update-form', (req, res) =>{

    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log('connected as id ' + connection.threadId)
        // Get tickets
        console.log(req.body);
        myQuery = "Update Tickets SET";
        if (!(req.body.assignedSpecialistID == 0)){
            myQuery += ' AssignedSpecialistID = "' + req.body.assignedSpecialistID +
            '", SolutionProvider = "' + req.body.assignedSpecialistID + '",'
        }else{
            myQuery += ' AssignedSpecialistID = NULL , SolutionProvider = NULL ,'
        }
        if(!(req.body.softwareID == 0)){
            myQuery += ' SoftwareID = "' + req.body.softwareID + '",'
        }else{
            myQuery += ' SoftwareID = NULL ,'
        }
        if(!(req.body.hardwareID == 0)){
            myQuery += ' HardwareID = "' + req.body.hardwareID + '",'
        }else{
            myQuery += ' HardwareID = NULL ,'
        }

        myQuery += ' TypeID = "' + req.body.typeID +
        '", FinalSolution = "' + req.body.finalSolution +
        '", ReporterID = "' + req.body.reporterID +
        '", TicketPriority = "' + req.body.ticketPriority +
        '", TicketState = "' + req.body.ticketState +
        '", TicketDescription = "' + req.body.ticketDescription +
        '" WHERE ID = "'+ req.body.ID + '"'
        connection.query(myQuery
        , (err, rows) => {
            connection.release() // return the connection to pool
  
            if (!err) {
                res.redirect(req.get('referer'));
            } else {
                console.log(err)
            }
        })
    })  
  })
  
module.exports = router