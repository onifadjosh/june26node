const express = require("express")
const app = express()
const dotenv = require("dotenv")
dotenv.config()
app.set("view engine", "ejs")
const mongoose = require("mongoose")
const cors = require("cors")
const path = require("path")
app.use(express.urlencoded({extended:true}))//body parser
app.use(express.json())
app.use(cors())
const UserRouter = require("./routes/User.routes")
const connectDB = require("./database/connectDb")


app.use("/api/v1", UserRouter)






//GET
//POST
//PUT
//PATCH
//DELETE

//100
//200 
//300
//400
//500

mongoose.connect(process.env.MONGODB_URI)
.then(()=>{
    console.log("Database connected successfully");
    
})

.catch((err)=>{
    console.log("Cannot connect to database", err);
    
})







let products =[
    {
        "title": "Essence Mascara Lash Princess",
        "price": 9.99,
        "description": "The Essence Mascara Lash Princess is a popular mascara known for its volumizing and lengthening effects. Achieve dramatic lashes with this long-lasting and cruelty-free formula.",
        "rating": 2.56,
        "stock": 99,

    },

    {
        "title": "Essence Mascara Lash Princess",
        "price": 9.99,
        "description": "The Essence Mascara Lash Princess is a popular mascara known for its volumizing and lengthening effects. Achieve dramatic lashes with this long-lasting and cruelty-free formula.",
        "rating": 2.56,
        "stock": 99,

    },
    {
        "title": "Essence Mascara Lash Princess",
        "price": 9.99,
        "description": "The Essence Mascara Lash Princess is a popular mascara known for its volumizing and lengthening effects. Achieve dramatic lashes with this long-lasting and cruelty-free formula.",
        "rating": 2.56,
        "stock": 99,

    }
]

// app.get(path , callback)
app.get("/", (request, response)=>{
        // response.send("Welcome to my node application")
        // response.send(1.23456781293)
        let students = ["pampam", "sade", 'kunle', "Benson"]
        // response.send(students)
        response.send(products)
})

app.get("/getFile", (req, res)=>{
    console.log(__dirname);//__dirname is to help you get the root dir you are in

  let fileToRender =  path.join(__dirname, "index.html")
  console.log(fileToRender);

  res.sendFile(fileToRender)
  
    
})

app.get("/ejsFile", (req, res)=>{

    let gender = "female"
    res.render('index', {gender, products})
})

app.get("/addProduct", (req, res)=>{
    res.render("addProduct")
})

app.post("/addProduct", (req, res)=>{
console.log(req.body);


products.push(req.body)
let gender="male"
res.render('index', {gender, products})
})



app.post("/delete/:id", (req, res)=>{
    console.log(req.params);

    products.splice(req.params.id, 1)
    let gender="male"
res.render('index', {gender, products})
})

app.get("/editProduct/:id", (req, res)=>{
    console.log(req.params);

    res.render("editProduct")
})

app.post("/editProduct/:id", (req, res)=>{
    const {title, price, description, rating, stock }= req.body
    const {id}= req.params
    products.splice(id, 1, req.body)
    let gender = "male"
    res.render("index", {gender, products})
})
app.get("/register", (req, res)=>{
    res.render("registerUser")
})




//cluster
//database
//collection
//documents






//creating of server
// app.listen("port", callback)

const PORT =process.env.PORT
app.listen(PORT,(err)=>{
    if(err){
        console.log("error starting server");
        
    }else{
        console.log("server started successfully");
        
    }
} )


module.exports=async(req, res)=>{
    await connectDB()

    return app(req, res)
}




