const express = require('express')
const session = require('express-session');
const router = express.Router()
const mysql = require('mysql')
const SQLStatement="SELECT t1.FullName,t1.AssignedSpecialistID, t1.Count, t2.CountDone,t3.CountProg,t4.CountToDo,t5.CountRev,t6.LongestToDo,t7.LongestInProg FROM (select Personnel.FullName,Tickets.AssignedSpecialistID,count(Tickets.AssignedSpecialistID) as \"Count\" from Tickets Inner join Personnel on Personnel.ID = Tickets.AssignedSpecialistID group by Tickets.AssignedSpecialistID ) as t1 left join (select AssignedSpecialistID,count(AssignedSpecialistID) as \"CountDone\" from Tickets where TicketState=\"Resolved\" group by AssignedSpecialistID) as t2 on t1.AssignedSpecialistID=t2.AssignedSpecialistID left join (select AssignedSpecialistID,count(AssignedSpecialistID) as \"CountProg\" from Tickets where TicketState=\"INPROGRESS\" group by AssignedSpecialistID) as t3 on t1.AssignedSpecialistID=t3.AssignedSpecialistID left join (select AssignedSpecialistID,count(AssignedSpecialistID) as \"CountToDo\" from Tickets where TicketState=\"TODO\" group by AssignedSpecialistID) as t4 on t1.AssignedSpecialistID=t4.AssignedSpecialistID left join (select AssignedSpecialistID,count(AssignedSpecialistID) as \"CountRev\" from Tickets where TicketState=\"INReview\" group by AssignedSpecialistID) as t5 on t1.AssignedSpecialistID=t5.AssignedSpecialistID left join (select Tickets.AssignedSpecialistID, DATEDIFF(CURRENT_TIMESTAMP , MIN(Tickets.CreatedTimestamp)) as \"LongestToDo\" from Tickets where TicketState=\"todo\"  group by Tickets.AssignedSpecialistID) as t6  on t1.AssignedSpecialistID=t6.AssignedSpecialistID left join (select Tickets.AssignedSpecialistID, DATEDIFF(CURRENT_TIMESTAMP , MIN(Tickets.CreatedTimestamp)) as \"LongestInProg\" from Tickets where TicketState=\"inprogress\"  group by Tickets.AssignedSpecialistID) as t7  on t1.AssignedSpecialistID=t7.AssignedSpecialistID"
const pool  = mysql.createPool({
    connectionLimit : 10,
    host            : 'localhost',
    user            : 'teamb006',
    password        : 'c0gjyXj0ZS',
    database        : 'teamb006'
})
const app = express();

app.use(session({secret: 'usernames',saveUninitialized: true,resave: true}));

router.get('/', (req, res) =>{
    sess = req.session;
	pool.getConnection((err, connection) => {
        if(err) throw err
        console.log('connected as id ' + connection.threadId)
        connection.query(SQLStatement, (err, rows) => {
            connection.release() // return the connection to pool

            if (!err) {
                res.render("analytics",{data : rows,username:sess.username})
            } else {
                console.log(err)
            }
            
          
        })
    })  

})
router.post('/',(req,res)=>{
                        
         res.render("analytics")
           
})



module.exports = router
