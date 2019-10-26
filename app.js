require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');

//Setup middleware
// -- can read JSON from res.body
app.use(express.json({extended: false}))

// Define Routes
app.use('/api/users/', require('./routes/users'));
app.use('/api/auth/', require('./routes/auth'));
app.use('/api/contacts/', require('./routes/contacts'));

// Load static content
if(process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
    app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html')));
}

module.exports = app;