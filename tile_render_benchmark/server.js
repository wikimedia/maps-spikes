'use strict';

const express = require('express')
const cors = require('cors')

const app = express();

app.use(cors());

const options = {
    dotfiles: 'ignore',
    etag: false,
    extensions: ['json'],
    index: false,
    maxAge: '1d',
    redirect: false,
    setHeaders: function (res, path, stat) {
        res.set('x-timestamp', Date.now())
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    }
}

app.use(express.static('public', options))

app.listen(3030);
