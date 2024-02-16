//--------------------------Import----------------------------------------------
require('dotenv').config()
const express = require("express")
 
const connectDB = require("./config/mongoDB.js")
connectDB()
const app = express()
const cors = require("cors")
const cookieParser = require("cookie-parser");
 
 
 



//----------------------------Middlewares------------------------------------------------
app.use(cookieParser("secret"));
app.use(cors())
app.use(express.json()) 
app.use(express.urlencoded({extended:true}))
app.set("view engine" , "ejs")
 
 
 
//-----------------------------CREATING-ROUTES--------------------------------------------
const userRoute = require("./Routes/api/router.js")
app.use('/api' , userRoute)

const viewRoute = require("./Routes/views/router.js")
app.use('/' , viewRoute)


/*

 -----------------------  For Frontend techs  -------------------

 MIDDLEWARES -: 
 const path = require("path")
 app.set('view engine' , 'ejs' )
 app.set("views", path.join(__dirname, "public"));

ROUTES -: 
 app.get('/register' , (req , res)=>{
     res.render('register')
 })

 app.get('/login' , (req , res)=>{
     res.render('login')

 })


*/
 


 //-----------------------------Listners--------------------------------------------------
const PORT = process.env.PORT || 6030
app.listen(PORT , ()=>{
     console.log(`Server is started at http://localhost:${PORT}`)
 })
 
