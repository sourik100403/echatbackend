//Node server which will handle socket io connections

// const io = require('socket.io')(8000)
const dotenv=require('dotenv')
dotenv.config();
const io = require("socket.io")(process.env.PORT || 5000, {
    //handline cors error
    cors: {
      origin: process.env.URL ,
      methods: ["GET", "POST"],
      credentials: true
    }
  });
  
const users ={};

io.on('connection',socket =>{
    //if any new user joined let other users connected to the server know!
    socket.on('new-user-joined',name =>{
        // console.log('New user',name);
        
        users[socket.id]=name;
        socket.broadcast.emit('user-joined',name);
    })

    //if someone sends a message, broadcast it to other people
    socket.on('send',message=>{
        socket.broadcast.emit('receive',{message:message,name: users[socket.id]})
    });

    //if someone leaves the chat , let the other kow here disconnect is built in
    socket.on('disconnect',message=>{
        socket.broadcast.emit('left',users[socket.id]);
        delete users[socket.id]
    });

})

//the upper code tells thatwe have initialize socket.io on port 8000 then we run a io.server which is instance of http server
// now this server is listening incoming events 
//io.on is a socket instance
//socket.on is for particular connection
//socket.broadcast.emit() emit everyone except that user joined
// even name can be anything of your choice or say custom name
