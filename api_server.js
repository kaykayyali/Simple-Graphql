require('dotenv').config()
const express = require('express');
const server = express();
const fs = require('fs');
const { env } = require('process');
const fake_data = JSON.parse(fs.readFileSync('fake_data.json', 'utf8'));




// Server Definition
class Api_server {
    constructor (app, data, port) {
        this.app = app;
        this.data = data;
        this.port = port
    }
    listen_port() {
        this.app.listen(this.port, () => {
            console.log(`API Listening on Port:${this.port}`)
        })
    }
    // Theses should be in their own files, but, meh
    load_routes() {
        this.app.get('/', (req, res) => {
            res.send('OK')
        })
        this.app.get('/movies', (req, res) => {
            console.log("GET /Movies")
            res.json(this.data.movies);
        })
        this.app.get('/genres', (req, res) => {
            console.log("GET /Genres")
            res.json(this.data.genres);
        })
    }
    start() {
        this.listen_port()
        this.load_routes()
    }
}


// Instantiate and start
let application = new Api_server(server, fake_data, process.env.API_PORT);
application.start();
