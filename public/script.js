const socket = io('/')
const videoGrid = document.getElementById('video-grid')
const myPeer = new Peer(undefined, { // create a new peer object. use undefined to let the server generate its own id
    host: location.hostname,
    port: location.port || (location.protocol === 'https:' ? 443 : 80)
}) 

const myVideo = document.createElement('video');
myVideo.muted = true;
const peers = {};

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    addVideoStream(myVideo, stream)

    myPeer.on('call', call => {
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream)
        })
    })

    socket.on('user-connected', userId => {
        connectToNewUser(userId, stream)
    })

    socket.on('user-disconnected', userId =>{
       if(peers[userId]) peers[userID].close()
    })
})

myPeer.on('open', id =>{
    socket.emit('join-room', ROOM_ID, id)
})

function connectToNewUser(userId, stream){
    const call = myPeer.call(userId, stream)
    const video = document.createElement('video')
    call.on('stream',userVideoStream => {
        addVideoStream(userVideoStream)
    })

    call.on('close', () => {
        video.remove()
    })

    peers[userID] =  call
}


socket.on('user-connected', userId =>{
    console.log('User connected: ' + userId)
})


function addVideoStream(video, stream){
    video.srcObject = stream
    video.addEventListener('loadmetadata', () =>{
        video.play()
    })
    videoGrid.append(video)
}