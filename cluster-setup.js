const cluster = require('cluster');
const {setupExpress} = require('./express-setup');

class ClusterHandler {

    constructor() {
        this.workers = [];
    }

    setupWorkerProcesses() {
        const numCores = require("os").cpus().length;
    
        console.log('Master cluster setting up ' + numCores + ' workers');
    
        const handleWorkerCb = (message) => {
            console.log("Worker says: " + message);
        }
    
        for(let i = 0; i < numCores; i++) {
            this.workers.push(cluster.fork());
            this.workers[i].on('message', handleWorkerCb);
        }
    
        cluster.on('online', (worker) => {
            console.log('Worker ' + worker.process.pid + ' is listening');
        });
    
        cluster.on('exit', (worker, code, signal) => {
            console.log('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
            console.log('Starting a new worker');
            this.workers.push(cluster.fork());
            this.workers[this.workers.length-1].on('message', handleWorkerCb);
        });
    }
    
    setupServer() {
    
        if(cluster.isMaster) {
            this.setupWorkerProcesses();
        } else {
            setupExpress();
        }
    
    }
}

module.exports = ClusterHandler;