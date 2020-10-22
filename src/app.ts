import express, {Application} from 'express';
import machineRoutes from './modules/machine/machine_routes';
import productsRoutes from './modules/products/products_routes';
import vendingRoutes from './modules/vending/vending_routes';
import clientsRoutes from './modules/clients/clients_routes';
import usersRoutes from './modules/user/user_routes';
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
app.use('/api/users', usersRoutes);
app.use('/api/clients', clientsRoutes);
app.use('/api/vendings', vendingRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/machine', machineRoutes);

export default app;