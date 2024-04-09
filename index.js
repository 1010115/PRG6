const express = require('express');
const connectDB = require("./db");
const idols = require('./routes/idols');

const app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use((req, res, next) => {
    const contentType = req.headers['content-type'];
    if (req.method === 'GET' && (!contentType || contentType !== 'application/json')) {
        return res.status(415).send('Unsupported Media Type');
    } else if (req.method === 'POST' && (!contentType || (contentType !== 'application/json' && contentType !== 'application/x-www-form-urlencoded'))) {
        return res.status(415).send('Unsupported Media Type');
    }
    next();
});

app.use('/api/idols', idols)

connectDB()

const port = 4000;

app.listen(port, () => console.log(`Listening on port ${port}...`));




