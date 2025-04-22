import express from 'express';
const mysql = require('mysql2');
const app = express();

app.use(express.json());

// Connect to MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'your_user',
  password: 'your_password',
  database: 'your_database'
});

db.connect((err: Error | null) => {
  if (err) {
    console.error('Error connecting to MySQL:', err );
    return;
  }
  console.log('MySQL connected!');
});

// Example route to test server
app.get('/', (req: express.Request, res: express.Response) => {
  res.send('API is running...');
});

// Start the server
const PORT = process.env.PORT || 8888;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
