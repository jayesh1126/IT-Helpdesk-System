const express = require('express')
const router = express.Router()
const mysql = require('mysql')

const pool  = mysql.createPool({
    connectionLimit : 10,
    host            : 'localhost',
    user            : 'teamb006',
    password        : 'c0gjyXj0ZS',
    database        : 'teamb006'
})

router.get('/', (req, res) =>{

    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log('connected as id ' + connection.threadId)
        connection.query('SELECT * from Software', (err, rows) => {
            connection.release() // return the connection to pool

            if (!err) {
                res.render("software",{data : rows,modalID:0,modalClicked:false})
            } else {
                console.log(err)
            }
            
          
        })
    })  
})
router.post('/',(req,res)=>{
    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log('connected as id ' + connection.threadId)
        if (req.body.Search!=null){
            connection.query('SELECT * from Software where SoftwareName LIKE "%'+req.body.Search +'%"', (err, rows) => {
                 // return the connection to pool
    
                if (!err) {
                    
                    res.render("software",{data : rows, modalID: req.body.ModalID || 0,modalClicked:req.body.ModalClicked,search: req.body.Search})
                } else {
                    console.log(err)
                }
    
               
                
            })
        }
        else if (req.body.update!=null){
            
            connection.query('UPDATE Software SET  SoftwareName = "'+req.body.software_name
            +'" , SoftwareVersion ="'+req.body.software_version
            +'", LicenseNumber="'+req.body.license_number
            +'" WHERE ID = "'+req.body.software_id
            +'";', (err, result) => {
                 // return the connection to pool
    
                if (!err) {
                    
                    
                } else {
                    console.log(err)
                }
            })
            connection.query('SELECT * from Software', (err, rows) => {
                // return the connection to pool
    
                if (!err) {
                    
                    res.render("software",{data : rows, modalID: req.body.ModalID|| 0,modalClicked:false})
                } else {
                    console.log(err)
                }
    
               
                
            })
        }
        else if (req.body.ModalClicked!=null){
            connection.query('SELECT * from Software', (err, rows) => {
                connection.query('SELECT * from Tickets where SoftwareID='+req.body.software_id, (err, extraInfo) => {
                     // return the connection to pool
        
                    if (!err) {
                        console.log(extraInfo)
                        res.render("software",{data : rows, modalID: req.body.ModalID|| 0,modalClicked:req.body.ModalClicked,extraInfo:extraInfo})
                    } else {
                        console.log(err)
                    }
        
                
                    
                })
            })
        }
        else if (req.body.Delete!=null){
            connection.query('Delete from Software where ID='+req.body.software_id
            +';', (err, result) => {
                 // return the connection to pool
    
                if (!err) {
                    
                    
                } else {
                    console.log(err)
                }
            })
            connection.query('SELECT * from Software', (err, rows) => {
                // return the connection to pool
    
                if (!err) {
                    
                    res.render("software",{data : rows, modalID: req.body.ModalID|| 0,modalClicked:false})
                } else {
                    console.log(err)
                }
    
               
                
            })
        }
        else if(req.body.New!=null){
         
            connection.query('INSERT into Software Values ("'+req.body.software_id
            +'", "'+req.body.software_name
            +'", "'+req.body.software_version
            +'", "'+req.body.license_number
            +'");', (err, result) => {           
                if (err) {
                    console.log(err)
                    
                } 
            })
            connection.query('SELECT * from Software', (err, rows) => {
                // return the connection to pool
   
               if (!err) {       
                   res.render("software",{data : rows, modalID: req.body.ModalID|| 0,modalClicked:false})
               } else {
                   console.log(err)
               }       
           })
        }
        else{
            connection.query('SELECT * from Software', (err, rows) => {
                 // return the connection to pool
    
                if (!err) {       
                    res.render("software",{data : rows, modalID: req.body.ModalID|| 0,modalClicked:false})
                } else {
                    console.log(err)
                }       
            })
        }
        connection.release()
    })
    
})

router.get('/new' , (req, res) =>{
  res.send("New Software Page")
})


module.exports = router