'use strict'

import express from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import apiLimiter from '../src/middlewares/validar-cant-peticiones.js';
import authRoutes from '../src/auth/auth.routes.js';
import channelRoutes from '../src/channel/channel.routes.js';
import channelSettingsRoutes from '../src/settingsChannel/settings.routes.js';
import { dbConnection } from './mongo.js';
import User from '../src/users/user.model.js'
import Channel from '../src/channel/channel.model.js'
import Message from '../src/messages/message.model.js'
class ExpressServer {
    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.authPath = '/kinalCast/v2/auth';
        this.channelPath = '/kinalCast/v2/channels';
        this.settingChannelPath = '/kinalCast/v2/settings';
        this.server = http.createServer(this.app);

        this.middlewares();
        this.conectarDB();
        this.routes();
    }

    async conectarDB(){
        await dbConnection();
    }

    middlewares(){
        this.app.use(express.urlencoded({extended: false}));
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(helmet());
        this.app.use(morgan('dev'));
        this.app.use(apiLimiter);
        this.app.use((req, res, next) => {
            const clientIp = req.connection.remoteAddress;
            console.log('La IP del cliente es: ', clientIp);
            next();
        });
    }

    routes(){
        this.app.use(this.authPath, authRoutes);
        this.app.use(this.channelPath, channelRoutes);
        this.app.use(this.settingChannelPath, channelSettingsRoutes);
    }

    listen(){
        this.server.listen(this.port, () => {
            console.log('Server running on port ', this.port);
        });
    }
}

export default ExpressServer;

