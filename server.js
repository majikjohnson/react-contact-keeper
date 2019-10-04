const express = require('express');
const connectDB = require('./config/db');

// Connect to DB
connectDB();

const app = express();

//Setup middleware
// -- can read JSON from res.body
app.use(express.json({extended: false}))

app.get('/', (req, res) => res.json({msg: "Welcome to Contact Keeper API"}));

// Define Routes
app.use('/api/users/', require('./routes/users'));
app.use('/api/auth/', require('./routes/auth'));
app.use('/api/contacts/', require('./routes/contacts'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));