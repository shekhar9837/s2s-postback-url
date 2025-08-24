import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './routes.js';

dotenv.config();
const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') ?? '*'
}));
app.use(express.json());

app.use('/', router);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`API on http://localhost:${port}`));
