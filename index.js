import express from 'express'
import { MongoClient, ObjectId } from 'mongodb';
import path from "path"



const app = express();
const publicPath = path.resolve('public')
app.use(express.static(publicPath))
app.use(express.urlencoded({extended:false}))

app.set("view engine",'ejs')

const dbName="todo-project"
const colledctionName = "todo_tasks"
const url = "mongodb://localhost:27017"
const client = new MongoClient(url)

const connection = async ()=>{
    const connect = await client.connect();
    return await connect.db(dbName)
}

app.get('/',async(req,res)=>{

    const db = await connection();
    const collecton = db.collection(colledctionName)
    const result = await collecton.find().toArray()
    // console.log(result)
    res.render("list",{result})
})

app.get('/add',(req,res)=>{
    res.render("add")
})

app.get('/update',(req,res)=>{
    res.render("update")
})

app.post('/store',async (req,res)=>{
    const db = await connection ();
    const collection = db.collection(colledctionName);
    const result = collection.insertOne(req.body)
    if(result)
    {
    res.redirect("/")
    }else{
    res.redirect("/add")
    }
})

app.get('/delete/:id',async (req,res)=>{
    const db = await connection ();
    const collection = db.collection(colledctionName);
    const result = collection.deleteOne({_id:new ObjectId(req.params.id)})  // mongo db need object id so we use "new ObjectId"
    if(result)
    {
    res.redirect("/")
    }else{
    res.redirect("/some-error")
    }
})


app.get('/update/:id',async (req,res)=>{
    const db = await connection ();
    const collection = db.collection(colledctionName);
    const result = await collection.findOne({_id:new ObjectId(req.params.id)})  // mongo db need object id so we use "new ObjectId"
    if(result)
    {
    res.render("update",{result})
    }else{
    res.redirect("/some-error")
    }
})


app.post('/edit/:id',async (req,res)=>{
    const db = await connection ();
    const collection = db.collection(colledctionName);
    const filter = {_id:new ObjectId(req.params.id)};
    const updatedData = {$set:{title:req.body.title,description:req.body.description}};
    const result = await collection.updateOne(filter,updatedData)  // mongo db need object id so we use "new ObjectId"
    if(result)
    {
    res.redirect("/")
    }else{
    res.redirect("/some-error")
    }
})

app.listen(3200)