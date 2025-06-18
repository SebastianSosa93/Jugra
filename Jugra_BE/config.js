const {config} = require("dotenv");
config();

const usr = process.env.usuario;
const pwd = process.env.contra;

const port = process.env.PORT || 3000;
const servidorFront = process.env.SERVIDORFRONT;
const SECRET_KEY = process.env.JWT_SECRET || "secretkey";
const adminClave = process.env.ADMIN_CLAVE;
const adminEmail = process.env.ADMIN_EMAIL;
const REFRESH_SECRET_KEY = process.env.RSK || "secretkey";


module.exports = {usr,pwd,port,servidorFront,SECRET_KEY,adminClave,adminEmail,REFRESH_SECRET_KEY};