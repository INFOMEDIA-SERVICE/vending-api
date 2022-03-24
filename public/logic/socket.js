const ws = new WebSocket('ws://localhost:3004/connection/');

var currentLocation = window.location;
ws.onopen = (e) => {
    console.log('connected');
    ws.send(JSON.stringify({
        type: 5,
        data: {
            user_id: '3fa85f64-5717-4562-b3fc-2c963f66afa6fsdfwsdf',
            machine_id: 'VM10003',
            products: [
                {
                    name: 'De toditos natural',
                    key: 10,
                    description: 'Superheroe Barra',
                    imagen: "https://drive.google.com/uc?export=download&id=1S-kbA1PmyaPGSemskTJh71T7tha0hbLw"
                }
            ],
            token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFuZHJlc0B0ZXN0LmNvbSIsInJvbGUiOjAsImlkIjoiNWNhOTI2YzgtNDRlZi00ZWU3LWFkOTItYTZmNGNmNTFmYzk1IiwiaWF0IjoxNjM3NjI4ODM1LCJleHAiOjE2Mzc2NzIwMzV9.FyOrfI50rM7bGFeMo5zO8xX9OM42iTs5Lw-KRKeAo8A"
        }
    }));
};

ws.onmessage = e => {
    console.log('message');
    console.log(JSON.parse(e.data));
};
