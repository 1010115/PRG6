const express = require('express');
const connectDB = require("./db");
const idols = require('./routes/idols');
const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use((req, res, next) => {
    const contentType = req.headers['content-type'];
if (req.method === 'POST' && (!contentType || (contentType !== 'application/json' && contentType !== 'application/x-www-form-urlencoded'))) {
        return res.status(415).send('Unsupported Media Type');
    }
    next();
});
app.use((req, res, next) => {
    if (req.method === 'GET') {
        const acceptType = req.headers['accept'];
        // Check if the Accept header is present and includes 'application/json'
        if (!acceptType || acceptType.indexOf('application/json') === -1) {
            return res.status(406).send('Not Acceptable');
        }

    }
next();
});

app.use('/api/idols', idols)

connectDB()

const port = 8001;

app.listen(port, () => console.log(`Listening on port ${port}...`));




