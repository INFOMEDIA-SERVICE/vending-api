import express, {Application} from 'express';
import userRoutes from './routes/user_routes';
import machineRoutes from './routes/machine_routes';
import http from 'http';
import path from 'path';

const app:Application = express();

export let server:http.Server = http.createServer(app);

const publicPath:string = path.resolve(__dirname, '../public');

app.use('/', express.static(publicPath));

app.set('port', 3000);

// Middelwares
app.use(express.json());

app.use(express.urlencoded({extended: false}));

// Routes
app.use('/users', userRoutes);
app.use('/machine', machineRoutes);

export default app;