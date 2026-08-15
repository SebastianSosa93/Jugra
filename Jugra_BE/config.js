const {config} = require("dotenv");
config();

const usr = process.env.usuario;
const pwd = process.env.contra;

const port = process.env.PORT;
const servidorFront = process.env.SERVIDORFRONT ||"http://127.0.0.1:3000";
const servidorBack = process.env.SERVIDORBACKEND || "http://localhost:3000";
const SECRET_KEY = process.env.JWT_SECRET;
const adminClave = process.env.ADMIN_CLAVE;
const adminEmail = process.env.ADMIN_EMAIL;
const REFRESH_SECRET_KEY = process.env.RSK;
const CORSORIGIN = process.env.SERVIDORFRONT;


module.exports = {usr,pwd,port,servidorFront,servidorBack,SECRET_KEY,adminClave,adminEmail,REFRESH_SECRET_KEY,CORSORIGIN};