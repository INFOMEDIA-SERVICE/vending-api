import express, {Application} from 'express';
import productsRoutes from './modules/products/products_routes';
import vendingRoutes from './modules/vending/vending_routes';
import usersRoutes from './modules/user/user_routes';
import adminRoutes from './modules/admin/admin_routes';
import clientsRoutes from './modules/clients/clients_routes';
import servicesRoutes from './modules/services/services_routes';
import swaggerUi from 'swagger-ui-express';
import http from 'http';
import cors from 'cors';

const app: Application = express();

export let server: http.Server = http.createServer(app);

app.set('port', process.env.PORT || 3004);

// Middelwares

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors());

// Routes

const swaggerDocument: any = require('../swagger.json');

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/api/users', usersRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/clients', clientsRoutes);
app.use('/api/vendings', vendingRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/admins', adminRoutes);

export default app;
