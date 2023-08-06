const express = require('express')
const app = express()
const port = 5006

app.use(express.urlencoded({ extended: true}))
app.use(express.json())

// Set up ejs
app.set("view engine", "ejs")

// index page
app.get('/', (req, res) => {
  console.log("Here")
  // Index is inside view, where we store our ejs files
  res.render("index", { text: "This text was passed from server.js"})
  // I passed the value defined here text into the ejs file index inside views
})

// To use css
app.use(express.static('public'));

// Inside routes folder, user.js
const userRouter = require('./routes/users')
// Can do this for all the different routes in the application
app.use('/users', userRouter)

const softwareRouter = require('./routes/software')
app.use('/software', softwareRouter)

const ticketRouter = require('./routes/ticket')
app.use('/ticket', ticketRouter)

app.listen(port, function(error){
  if (error){
    console.log("Something went wrong", error)
  } else {
    console.log("Server is listening on port " + port)
  }
})

