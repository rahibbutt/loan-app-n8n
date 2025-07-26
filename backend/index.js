require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS before all routes
app.use(cors({
    origin: 'http://localhost:5173', // allow frontend dev server
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true // only if using cookies or auth headers
}));

// Parse JSON requests
app.use(bodyParser.json());

// Route setup
app.use('/auth', authRoutes);

app.post('/auth/register', (req, res) => {
    res.json({ message: 'Direct register route works!' });
});
// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
