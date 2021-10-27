const ws = new WebSocket('ws://localhost:3004/connection/');

ws.onopen = (e) => {
    console.log('connected');
    ws.send(JSON.stringify({
        type: 2,
        data: {
            user_id: 'andres.carrillo.1001',
            device_id: 'VM10003',
        }
    }));
};

ws.onmessage = e => {
    console.log('message');
    console.log(JSON.parse(e.data));
};
