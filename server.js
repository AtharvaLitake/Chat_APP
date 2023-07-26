const express=require('express');
const app=express();
//server creation
const http=require('http').createServer(app);
const PORT=process.env.PORT ||3000;
http.listen(PORT,()=>{
    console.log(`Listening on Port ${PORT}`);
})

//for all the static files
app.use(express.static(__dirname+'/public'))

//rendering html
app.get('/',(req,res)=>
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


