$(document).ready(async function () {

    const socket = io();

    var video = document.getElementById('video');
    let chunks = [];

    $("#canRecordAlert").text("Can not record");

    if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        $("#canRecordAlert").text("Can record");
        let stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        
        const mediaRecorder = new MediaRecorder(stream);

        document.getElementById("start").addEventListener("click", function() {
            mediaRecorder.start();
            video.srcObject = stream;
            video.play();
        });

        document.getElementById("stop").addEventListener("click", function() {
            mediaRecorder.stop();
            video.pause();
        });

        mediaRecorder.onstop = (e) => {
            var blob = new Blob(chunks, {mimeType: 'video/webm; codecs=vp9'});
            chunks = [];
            let ioStream = ss.createStream();
            ss(socket).emit('video-stream', ioStream, {filename: Date.now() + ".webm"});
            let blobStream = ss.createBlobReadStream(blob);
            blobStream.pipe(ioStream);

            let size = 0;
            blobStream.on('data', chunk => {
                size += chunk.length;
                $("#progress").prop('value', Math.floor(size / blob.size * 100));
            });

        };

        mediaRecorder.ondataavailable = (e) => {
            chunks.push(e.data);
        };
    }
    
});