const express = require('express');
const http = require('http');
const cors = require('cors');
const app = express();
const server = http.createServer(app);
const { Socket } = require('socket.io');
const { table } = require('console');
const io = require('socket.io')(server,{
    cors:{
        origin:'*',
        methods:['GET','POST'],
    }
});

app.use(cors());

app.get('/',(req,res)=>{
    res.send('Hi ,how are you?')
})

io.on('connection',(socket)=>{

    console.log("user connected");

    socket.emit('me',socket.id);

    socket.on('callUser',(data)=>{
        io.to(data.userToCall).emit('callUser',{signal:data.signalData,from:data.from,name: data.name});
    });
    
    socket.on('answerCall',(data)=>{
        io.to(data.to).emit('callAccepted',data.signal);
    })

    socket.on('disconnect',()=>{
        console.log("user disconnected");
    });

});

const port = process.env.PORT || 4000;

server.listen(port, () => {
    console.log('Server listening at port %d', port);
});