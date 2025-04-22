import express, { Request, Response } from 'express';
import dotenv from 'dotenv';

import db from './db/models';
import userRouter from './routes/user';

dotenv.config();

const app = express();
app.use(express.json());

// Test the database connection
db.sequelize
    .authenticate()
    .then(() => console.log('✅ Database connected via Sequelize'))
    .catch((err: any) => {
        console.error('❌ Unable to connect to database:', err);
        process.exit(1);
    });

app.use('/api/users', userRouter);

//endpoint
app.get('/', (_req: Request, res: Response) => {
    res.send('API is up and running!');
});

// Start the server
const PORT = process.env.PORT || 8888;
app.listen(PORT, () => {
    console.log(`🚀 Server listening on http://localhost:${PORT}`);
});
