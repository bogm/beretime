const express = require('express')
const app = express();
const server = require('https').Server(app) //craete a server 
const io = require('socket.io')(server) //pass the server to socket io
const {v4: uuidV4} = require('uuid')


app.set('view engine', 'ejs') //set our view engine with ejs
app.use(express.static('public')) //set up static folder

app.get('/', (req, res) =>{
    res.redirect(`/${uuidV4()}`) //pass the uuid function to get a dynamic id
})

app.get('/:room', (req, res) =>{ //get the room view
    res.render('room', {roomId: req.params.room})
})

io.on('connection', socket => { //call socket io with an event liustener as soon as room id and user id are set up
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId) //join new room 
        socket.to(roomId).broadcast.emit('user-connected', userId) //send the message to the room we're in 
        
        socket.on('disconnect', () => {
            socket.to(roomId).broadcast.emit('user-disconnected', userId)
        })
    
    })
})

server.listen(process.env.PORT || 80);