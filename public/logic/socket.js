const ws = new WebSocket('ws://localhost:3004/connection/');

var currentLocation = window.location;

ws.onopen = (e) => {
    console.log('connected');
    ws.send(JSON.stringify({
        type: 7,
        data: {
            user_id: 'andres.carrillo::100',
            // user_id: makeid(20),
            machine_id: 'VM10003',
            locker_name: 'LOCKER-10005',
            box_name: 'B45',
            products: [
                {
                    name: 'De toditos natural',
                    key: 10,
                    description: 'Superheroe Barra',
                    imagen: "https://drive.google.com/uc?export=download&id=1S-kbA1PmyaPGSemskTJh71T7tha0hbLw"
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
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}

console.log(makeid(5));
