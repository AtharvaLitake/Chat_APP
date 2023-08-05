const express=require('express');
var bodyParser=require('body-parser')
var mongoose=require('mongoose');
const { resourceLimits } = require('worker_threads');
const app=express();
//server creation
const http=require('http').createServer(app);
const PORT=process.env.PORT ||3000;
http.listen(PORT,()=>{
    console.log(`Listening on Port ${PORT}`);
})

//for all the static files
app.use(express.static(__dirname+'/public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended:true
}))
mongoose.connect('mongodb://127.0.0.1:27017/ChatApp',{
    useNewUrlParser:true,
    useUnifiedTopology:true
})
var db=mongoose.connection;
db.on('error',()=>console.log("Error Connecting"))
db.once('open',()=>console.log("Connected to database"))
const user_name=[];
const attri1=[];
const attri2=[];
const attri3=[];
//store data
app.post('/signup',(req,res)=>{
    var name=req.body.name;
    var att1=parseInt(req.body.att1);
    var att2=parseInt(req.body.att2);
    var att3=parseInt(req.body.att3);
    var data={
        "name":name,
        "Attribute1":att1,
        "Attribute2":att2,
        "Attribute3":att3,
    }
    db.collection('Users').insertOne(data,(err,collection)=>{
        if(err)
        {
            throw err;
        }
        console.log("Record Inserted Successfully")
    });
    //retrieving data
    async function retrieval()
    {
        const cursor=await db.collection('Users').find({},{name:1,Attribute1:0,Attribute2:0,Attribute3:0});
        const result=await cursor.toArray();
        //console.log(result)
        for(let i=0;i<result.length;i++)
        {
            user_name.push(result[i].name)
            attri1.push(result[i].Attribute1)
            attri2.push(result[i].Attribute2)
            attri3.push(result[i].Attribute3)
        }

    }
    retrieval().then(async=()=>
    {
            min1=9999;
            min2=9999;
            min3=9999;
            index1=-1;
            index2=-1;
            index3=-1;
            for(let i=0;i<attri1.length;i++)
            {
                if(attri1[i]<min1)
                {
                    min1=attri1[i];
                    index1=i;
                }
                if(attri2[i]<min2)
                {
                    min2=attri2[i];
                    index2=i;
                }
                if(attri3[i]<min3)
                {
                    min3=attri3[i];
                    index3=i;
                }
            }
            console.log(user_name[index1])
            console.log(user_name[index2])
            console.log(user_name[index3])
    } )
    return res.redirect('index')
})

//rendering html
app.get('/',(req,res)=>
{
    res.sendFile(__dirname+'/form.html');
})
app.get('/index',(req,res)=>
{
    res.sendFile(__dirname+'/index.html');
})

//Socket
const io = require('socket.io')(http)

io.on('connection', (socket) => {
    console.log('Connected...')
    socket.on('message', (msg) => {
        socket.broadcast.emit('message', msg)
    })
})


