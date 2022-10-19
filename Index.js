const express =require("express")
const app=express()
require('dotenv').config()
const cors=require("cors")
const mongoose=require('mongoose')
const {User}=require('./Router/routes')

const PORTS=process.env.PORT || 6500
mongoose.connect(process.env.MONGO_DB, {useNewUrlParser: true, useUnifiedTopology: true},()=>{
    console.log('mongo connected')
})
app.use(cors())
app.use(express.json())
app.use('/',User)
app.listen(PORTS,()=>{
    console.log('Server Running')
})