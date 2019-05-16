const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const app = express();

const http = require('http');
const server = http.createServer(app);

const path = require('path');

const setupRoutes = () => {
    // put routes here
}

const setupExpress = () => {
    app.use(morgan('tiny'));
    app.use(bodyParser.json());
    app.disable('x-powered-by');

    setupRoutes();

    // console.log(__dirname );
    app.use(express.static(__dirname + '/public'));
    // app.use((req, res) => {
    //     res.sendFile(path.join(__dirname + '/public/index.html'));
    // });

    

    server.listen(3000);
    console.log(`Started server on http://localhost:3000 for Process id ${process.pid}`);

    app.on('error', (err, ctx) => {
        console.error('app error', err.stack);
        console.error('on url', ctx.req.url);
        console.error('with headers', ctx.req.headers);
    });
};

module.exports = {setupExpress, app, server};