import { resolve as pathResolve } from 'path';
import { config } from 'dotenv';

const { env } = process;
config({ path: pathResolve(__dirname, `./env/.env.${env.NODE_ENV}`) });

export default {
  environment: env.NODE_ENV,
  port: Number(env.PORT),
  mongo: {
    url: env.MONGODB_URL,
    debug: env.MONGODB_DEBUG === 'true' || false,
    connectionOptions: {
      autoReconnect: process.env.MONGODB_AUTO_RECONNECT === 'false' ? false : true,
      socketTimeoutMS: Number(process.env.MONGODB_SOCKET_TIMEOUT) || 1800000,
      connectTimeoutMS: Number(process.env.MONGODB_CONNECT_TIMEOUT) || 30000,
      reconnectTries: Number(process.env.MONGODB_RECONNECT_TRIES) || Number.MAX_VALUE,
      reconnectInterval: Number(process.env.MONGODB_RECONNECT_INTERVAL) || 1000,
      useNewUrlParser: true
    }
  }
};
