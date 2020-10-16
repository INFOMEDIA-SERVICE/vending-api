const ws = new WebSocket('ws://localhost:3000/connection');

ws.onopen = (e) => {
    console.log('connected');
    // setTimeout(function(){
    //     ws.send(JSON.stringify({
    //         type: 0, 
    //         data: {

    //         }
    //     }));
    // }, 1000);
};

ws.onmessage = e => {
    console.log('message');
    console.log(JSON.parse(e.data));
};
