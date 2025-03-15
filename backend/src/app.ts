import express from 'express';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello from Express with TypeScript!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
