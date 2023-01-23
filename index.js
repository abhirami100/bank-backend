//import express inside index.js file

const express=require('express')

//import dataservice
const dataservice =require('./services/data.service')

//import cors
const cors =require('cors')

//import jsonwebtoken
const jwt = require('jsonwebtoken')


//create server app using express
const app = express()

//to define origin using cors
app.use(cors({
    origin:'http://localhost:4200'

}))



//set up port for server app
app.listen(3000,()=>{
    console.log('server started at 3000');
})


//Application specific Middleware
const appMiddleware = (req,res,next)=>{
    console.log("Application specific Middleware");
    next()
}
//to use in entire application
app.use(appMiddleware)




// //to resolve client http request

// app.get('/',(req,res)=>{
//     res.send("GET REQUEST")
// })

// app.post('/',(req,res)=>{
//     res.send("POST REQUEST")
// })
 
// app.put('/',(req,res)=>{
//     res.send("PUT REQUEST")
// })

// app.patch('/',(req,res)=>{
//     res.send("PATCH REQUEST")
// })

// app.delete('/',(req,res)=>{
//     res.send("DELETE REQUEST")
// })






//to parse json
app.use(express.json())

//bank server api request resolving

//jwt token verification middleware
const jwtMiddleware = (req,res,next)=>{

    console.log('Router specific middleware');

    //1. get token  from request header in access-token
    const token = req.headers['access-token']

    //2. verify token using  verify method in jsonwebtoken
    try{
        const data = jwt.verify(token,"secretkey12345")
        //assigning login user acno to currentAcno in req
        req.currentAcno = data.currentAcno
        // console.log(data);
        next()
    }
    catch{
        res.status(422).json({
            status:false,
            message:'please Log In'
        })
    }
}

//login API -resolve

app.post('/login',(req,res)=>{
    console.log(req.body);

    //asynchronous

    dataservice.login(req.body.acno,req.body.pswd)
    .then((result)=>{
        res.status(result.statusCode).json(result)
    })
})


//register API -resolve

app.post('/register',(req,res)=>{
    console.log(req.body);

    //asynchronous

    dataservice.register(req.body.acno,req.body.pswd,req.body.uname)
    .then((result)=>{
        res.status(result.statusCode).json(result)
    })
})


// deposit API -resolve -Router specific middleware
app.post('/deposit',jwtMiddleware, (req, res) => {
    console.log(req.body);
    // asyncronous
    dataservice.deposit(req,req.body.acno, req.body.pswd, req.body.amount)
        .then((result) => {
            res.status(result.statusCode).json(result)
        })

})


// withdraw API -resolve -Router specific middleware
app.post('/withdraw',jwtMiddleware, (req, res) => {
    console.log(req.body);
    // asyncronous
    dataservice.withdraw(req,req.body.acno, req.body.pswd, req.body.amount)
        .then((result) => {
            res.status(result.statusCode).json(result)
        })

})


// transaction API -resolve -Router specific middleware
app.get('/transaction/:acno',jwtMiddleware, (req, res) => {
    console.log(req.params);
    // asyncronous
    dataservice.transaction(req.params.acno)
        .then((result) => {
            res.status(result.statusCode).json(result)
        })

})

//deleteAcno API 
app.delete('/deleteAcno/:acno',jwtMiddleware, (req, res) => {
    // console.log(req.params);
    // asyncronous
    dataservice.deleteAcno(req.params.acno)
        .then((result) => {
            res.status(result.statusCode).json(result)
        })

})



