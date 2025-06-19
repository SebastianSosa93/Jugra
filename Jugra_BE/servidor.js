const http = require('http');
const https = require('https');
const fs = require('fs');
const express = require('express');
const config = require('./config.js');
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

const corsOptions = {
  origin: config.CORSORIGIN, //permite sólo este origen
  methods: ["GET", "POST", "PUT", "DELETE"], //Métodos permitidos
  allowedHeaders: ["Content-Type", "Authorization"], //headers permitidos
  credentials: true, //solo usando cookies o headers de autenticación.
}

app.use(cors(corsOptions));

app.use(cookieParser());

function iniciarServidor(){
 
    // const options = {
    //     key: fs.readFileSync('./key.pem'),
    //     cert: fs.readFileSync('./cert.pem')
    // };

    app.listen(config.port,()=>{
        console.log(`servidor backend levantado`);
    });
    // http.createServer((req,res)=>{
    //     res.writeHead(301, {Location: `https://localhost:${config.port}${req.url}`});
    //     res.end();
    // }).listen(3000, ()=>{
    //     console.log('Servidor http en http://localhost:3000 redirigiendo a https');
    // });
    
    // https.createServer(options, app).listen(config.port, () => {
    //     console.log(`Servidor HTTPS corriendo en puerto ${config.port}`);
    // });
}

module.exports = {iniciarServidor,app};