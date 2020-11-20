const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const next = require('next');
const WebSocket = require('ws');

const dev = process.env.NODE_NOV !== 'production';
const nextApp = next({dev});
const nextHandler = nextApp.getRequestHandler();

let port = process.env.PORT || 3000;
let host = process.env.HOST || 'http://localhost';

subscribe = {
    'eventName':'subscribe',
    'authorization':'45a7c1bfaff6a70f9ed2ee2f3b9a10ecb4759a42',
    'eventData': {
        'thresholdLevel': 2,
    }
}

io.on('connection', socket => {
    console.log('connected');
    var ws = new WebSocket('wss://api.tiingo.com/crypto');
    console.log('query params => ',socket.handshake.query['symbol']);

    ws.on('open', function open() {
        subscribe.eventData.tickers = [socket.handshake.query['symbol']];
        ws.send(JSON.stringify(subscribe));
    });
    
    ws.on('message', function(data, flags) {
        // console.log('api message => ',data);
        const parseData = JSON.parse(data);
        if(parseData.data && parseData.data[0] === 'Q') {
            socket.emit('api message', {
                message: data
            });
        }
    });
    
    ws.on('error', (e) => {
        console.log('error => ',e.code);
        socket.emit('error', {
            message: e
        });
    });

    socket.on('disconnect', () => {
        console.log('disconnected');
        ws.close();
    })
});

nextApp.prepare().then(() => {
    app.get('*', (req, res) => {
        return nextHandler(req, res);
    });

    server.listen(port, err => {
        if(err) throw err;
        console.log(`> Ready on ${host}:${port}`);
    })
})