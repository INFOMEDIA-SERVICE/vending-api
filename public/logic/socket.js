const ws = new WebSocket('ws://localhost:3004/connection/');

var currentLocation = window.location;

ws.onopen = (e) => {
    console.log('connected');
    ws.send(JSON.stringify({
        type: 4,
        data: {
            user_id: 'andres.carrillo::100',
            // user_id: makeid(20),
            machine_id: 'VM10003',
            locker_name: 'LOCKER-10002',
            box_name: 'B11',
            // products: [
            //     {
            //         key: 10,
            //         quantity: 1,
            //     }
            // ],

            // Add products
            products: [
                {
                    key: 11,
                    stock: 20,
                    description: "French Frites TEST 2",
                    imagen: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Google_Images_2015_logo.svg/640px-Google_Images_2015_logo.svg.png",
                    name: "Product test",
                }
            ],
            token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJAYXRtIjp0cnVlLCJpc3MiOiJhbmRyZXMuY2FycmlsbG8iLCJleHAiOjE2NDk0ODA0MDAsImlhdCI6MTYxODk4MTIwMH0.UwHaA-M4iM3pGZ83R3A7IbrCu3oN3UUQRYMd5jAn9xk"
        }
    }));
};

ws.onmessage = e => {
    console.log('message');
    console.log(JSON.parse(e.data));
};

function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

console.log(makeid(5));
