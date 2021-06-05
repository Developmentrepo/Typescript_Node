const DEFAULT_PORT = 3000;
import dotenv from 'dotenv'

dotenv.config();

export const CONFIGURATIONS = {
    JWT: {
        VERIFY_TOKEN_URL: String(process.env.JWT_VERIFY_TOKEN_URL),
    },
    SERVER: {
        PORT: process.env.PORT || DEFAULT_PORT
    },
    GEO_CODER: {
        provider: <any>process.env.GEOCODER_PROVIDER,
        apiKey: <string>process.env.GEOCODER_API_KEY,
        httpAdapter: <any>process.env.GEOCODER_PROTOCOL
    },
    DB: {
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
        ssl: process.env.DB_SSL_MODE || false,
        max: process.env.MAX_POOL_SIZE,
        min: process.env.MIN_POOL_SIZE,
        keepAlive: !!process.env.DB_KEEP_ALIVE
    }
};

export default CONFIGURATIONS;
