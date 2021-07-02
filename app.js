require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const paymentRoutes = require('./routes/paymentRoutes')
const { checkUser } = require('./middleware/authmiddleware')

const PORT = process.env.PORT
const app = express()
app.use(cors())
app.use(express.json())

app.use(
    express.urlencoded({
      extended: false,
    })
);
app.set("view engine", "ejs");

// Atlas Database Connection
const dbURI = process.env.MONGODB_URI;
mongoose.connect(dbURI, { useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true, useCreateIndex:true })


app.listen(PORT, console.log('Listening to payments service at port '+PORT))

// Routes
//app.get('*', checkUser)
app.use('/payment',paymentRoutes)
app.get('/',(req,res) => res.send('Hello World from payments service'))
