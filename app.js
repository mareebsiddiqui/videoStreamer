const ClusterHandler = require('./cluster-setup');
const cluster = new ClusterHandler();

const {server} = require('./express-setup');

const io = require('socket.io').listen(server);
const ss = require('socket.io-stream');

const fs = require('fs');
const path = require('path');

cluster.setupServer();

io.on('connection', async (socket) => {
    console.log('connected');
    ss(socket).on('video-stream', async (stream, data) => {
        stream.pipe(fs.createWriteStream(path.join(__dirname, 'vids/'+data.filename)));
        process.send('File stored by worker process id ' + process.pid);
    });
});