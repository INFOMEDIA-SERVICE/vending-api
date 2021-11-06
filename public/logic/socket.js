const ws = new WebSocket('ws://localhost:3004/connection/');

var currentLocation = window.location;
ws.onopen = (e) => {
    console.log('connected');
    ws.send(JSON.stringify({
        type: 3,
        data: {
            user_id: 'andres.carrillo.1001' + currentLocation.href.split('?')[1] || '',
            machine_id: 'VM10003',
            products: [
                {
                    "key": 10,
                    "quantity": 2,
                },
                {
                    "key": 11,
                    "quantity": 1,
                },
            ],
        }
    }));
};

ws.onmessage = e => {
    console.log('message');
    console.log(JSON.parse(e.data));
};
