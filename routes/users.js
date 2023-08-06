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
  if (sess.type>=0){
    pool.getConnection((err, connection) => {
      sess = req.session;
        if(err) throw err
        console.log('connected as id ' + connection.threadId)
        // Get tickets
        connection.query('SELECT * from Tickets;SELECT * from ProblemType;SELECT * from Personnel;SELECT * from Specialist;SELECT * from Software;SELECT * from Hardware', (err, rows) => {
            connection.release() // return the connection to pool

            if (!err) {
                res.render("users",{queries : rows,username:sess.username})
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

/*
router.post('/onCreateUserClick', (req, res)=>{
  const {ID, CreatedTimestamp, TypeID, SoftwareID, HardwareID, ReporterID, TicketDescription, TicketPriority, AssignedSpecialistID} = req.body;
  if(ID && CreatedTimestamp && TypeID && SoftwareID && HardwareID && ReporterID && TicketDescription && TicketPriority){
    try{
      db.promise().query(`INSERT INTO Tickets VALUES('${ID}','${CreatedTimestamp}','${TypeID}','${SoftwareID}','${HardwareID}','${ReporterID}','${TicketDescription}','${TicketPriority}')`)
    }
    catch(err){
      console.log(err);
    }
  }
})
*/

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

router.post('/create-form', (req, res) =>{
  pool.getConnection((err, connection) => {
    if(err) throw err
    console.log('connected as id ' + connection.threadId)

    myQuery = "INSERT INTO `Tickets` (`ID`, `CreatedTimestamp`, `TypeID`, `SoftwareID`, `HardwareID`, `ReporterID`, `TicketDescription`, `TicketPriority`, `FinalSolution`, `SolutionProvider`, `ResolvedTimestamp`, `TicketState`, `AssignedSpecialistID`, `OperatorID`) VALUES (";

    console.log("sID: "+req.body.softwareID)

    myQuery += '"'+ req.body.problemID +'", '+
     'CURRENT_TIMESTAMP' +', "'+
     '1' +'", ';

     if(!(req.body.softwareID == 0)){
         myQuery += '"'+ req.body.softwareID + '", ';
     } else{
       myQuery += 'NULL, ';
     }

     if(!(req.body.hardwareID == 0)){
        myQuery += '"'+ req.body.hardwareID + '", "';
     } else{
       myQuery += 'NULL, "';
     }


    myQuery += req.body.reporterID +'", "'+
     req.body.ticketDescription +'", "'+
     req.body.ticketPriority +'", '+
     'NULL' +', '+
     'NULL' +', '+
     'NULL' +', '+
     '"INPROGRESS"' +', '+
     'NULL' +', '+
     'NULL' +')';

//req.body.typeID
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
