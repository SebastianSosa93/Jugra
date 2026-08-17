//Nombre del proyecto: JuGra(Jugar Gratis)

/*
Objetivo: Poder acceder a una lista de los juegos gratis que existen y que es posible jugarlos,
 de manera legal. Pensado para personas que no tienen dinero para comprar juegos, o bien, no quieren gastar
 dinero en eso.
 
 La idea es que puedan conocer que juegos hay disponibles, crear una lista de juegos favoritos, ordenarlos
 como deseen y además obtener información sobre cada juego, por ejemplo saber de que genero es o en que 
 plataforma se puede jugar.

 En resumen, Jugra permite:
 ·Obtener información de cada juego. 
 .Agregar o borrar juegos en una lista personalizada. 
 .Ordenar los juegos por: nombre o id.
 .Calificar los juegos con una valoración del 1 al 10  
 .Marcar los juegos como jugado, no jugado, terminado, etc. 
 .Agregar un comentario (opinion) sobre cada juego. 
*/
const express = require("express");
const morgan = require("morgan");
const bcryptjs = require("bcryptjs");
const cors = require("cors");
const jwt = require('jsonwebtoken');
const {body, validationResult} = require('express-validator');
const sanitizeHtml = require ('sanitize-html');
const ratelimit = require('express-rate-limit');
const cookieParser = require("cookie-parser");

const {getJuegos,getUnJuego, getFavoritos,getUnFavorito, getInfo,getEstado,ordenarJuegos,insertUsuario,insertFavorito, getUsuarios,getUsuario,modificarRol, getInfoPorID, actualizarInfo,actualizarFavoritos,borrarFavorito} = require("./db");

const {traducirTexto} = require("./traductor.js");

const {servidorBack, servidorFront,port,SECRET_KEY,REFRESH_SECRET_KEY,adminEmail, adminClave} = require("./config.js");

const {iniciarServidor,app} = require('./servidor.js');

let refreshTokens=[];

app.use(express.text());
app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use(morgan('dev'));

// Middleware para redirigir HTTP a HTTPS
// app.use((req, res, next) => {
//   if (!req.secure && req.headers.host == 'localhost:3000') {
//     return res.redirect('https://' + req.headers.host + req.url);
//   }
//   next();
// });

//configuración para el límite de peticiones
const limiter = ratelimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Demasiadas solicitudes, intenta más tarde"
});

app.use('/login',limiter);

app.set('trust proxy', 1 /* number of proxies between user and server */);

async function loadData() {
  try{
    require("./carga.js");
  }catch(error){
    console.log("No se encontró el archivo requerido para la carga en la base de datos");
  }
  try {
    let loginOk = false;
  //  let email;
    let tokenMuertos = [];
      //defino al admin de la página
     const admin = {nombre: 'Sebastián', apellido: 'Sosa', email: adminEmail, password: await bcryptjs.hash(adminClave,8), rol:'admin'};

     //testeo si el admin ya está registrado en la base datos
     const adminObtenido = await getUsuario(adminEmail)
    if(!adminObtenido){
      insertUsuario(admin.nombre,admin.apellido,admin.email,admin.password,admin.rol);
      console.log("El admin se agregó a la base de datos");
    }else if(adminObtenido.rol !== 'admin'){
      await modificarRol(adminObtenido.usuarioID,'admin');
      console.log("Se detectó un error en el rol del admin y se corrigió");
    }else{
      console.log("El admin ya existe en la base de datos");
    }
      app.get('/ip', (request, response) => response.send(request.ip))
      
      app.post('/refresh-token',(req,res)=>{
        const refreshToken = req.cookies.refreshToken;
        console.log(`El refresh token que manda el front es: ${refreshToken}`)
        if(!refreshToken)return res.status(401).json({error: 'No autorizado'});

        //Verificar si el refresh token es válido.
        if(!refreshTokens.includes(refreshToken)){
          return res.status(403).json({error: 'Refresh invalido'});
        }

        jwt.verify(refreshToken, REFRESH_SECRET_KEY, (err, usuario) =>{
          if(err) return res.status(403).json({error: "token invalido"});
          
          //generar un nuevo accessToken
          const tokenNuevo = jwt.sign({ID: usuario.usuarioID, email: emailSeguro, nombre: usuario.nombre + " " + usuario.apellido,rol: usuario.rol }, SECRET_KEY, {
              expiresIn : '15m'
          });
           
           console.log("token nuevo: "+tokenNuevo);
            res.json({accessToken: tokenNuevo});
        });
        
      });

      app.get('/config', (req, res) => {
        res.json({servidorFront: servidorFront, puerto: port, servidorBack: servidorBack});
      });

      app.get("/",async(req,res)=>{
        
        res.redirect(`/juegos`);
      })
        //Se muestran los juegos ordenados por número(por defecto) o en orden alfabético, según la opción elegida.

      app.get("/juegos", async(req,res) =>{
        let orden = req.query.orden;
        const lista_juegos = await getJuegos();
        const informacion_juegos = await getInfo();
                
        if(orden){
        res.json({juegos : await ordenarJuegos(orden), informacion: informacion_juegos});
        }else{
         res.json({juegos : lista_juegos, informacion: informacion_juegos});
        }
      });

      app.get("/info",async(req,res)=>{        
        const id = req.query.juegoID;
        const juegos = await getJuegos();
        let titulo;
        for(i=0; i<juegos.length; i++){
          if(juegos[i].juegoID === parseInt(id)){
              titulo = juegos[i].titulo;
          }
        }
        
        info = await getInfoPorID(id);
        const imagen = info.imagen;
        const descripcion = info.descripcion;
        const enlace = info.enlace;
        const plataforma = info.plataforma;
        const distribuidor = info.distribuidor;
        const desarrollador = info.desarrollador;
        const fecha = info.fecha;
        res.json(
          {
            titulo : titulo,
            imagen : imagen,
            descripcion : descripcion,
            enlace : enlace,
            plataforma : plataforma,
            distribuidor : distribuidor,
            desarrollador : desarrollador,
            fecha : fecha
          });
      })

      //verifica que existe un orden y lo cambia en el cliente según la opción elegida por el usuario.
      app.put("/juegos",async(req,res)=>{
        const orden = req.body.orden;
        let existe;

        if(orden){
        existe = true;
        }else{
        existe = false;
        }
        res.json({existe: existe})
      });
      
      //renderiza la pagina de registro de usuario
      app.get("/registro",async(req,res) =>{
        res.json({mensaje: 'mostrando registro'});
      });
      //renderiza la pagina de login
      app.get("/login",async(req,res) =>{
        if(loginOk){
          res.status(200).json({mensaje: 'Login cargado correctamente'});
        }else{
          res.status(404).json({mensaje: 'No hay usuario logueado'});
        }
      });
    
       //Middleware para verificar token
      const verificarToken = async (req,res,next) => {
       const tokenRefresh = req.headers["authorization"];
       
      const token = req.cookies.token;
     console.log(`este es el token: ${token}`);
       if(!token && !tokenRefresh) return res.status(403).json({mensaje: "Token requerido" });

       if(tokenRefresh){
          jwt.verify(tokenRefresh.split(" ")[1], SECRET_KEY, (err, decoded)=> {
            if(err || tokenMuertos.includes(tokenRefresh)) return res.status(401).json({ mensaje: "Token inválido"});
       
            req.usuario = {ID: decoded.ID, email: decoded.email, nombre: decoded.nombre, rol: decoded.rol}; // Guarda la info del usuario en la request.
            req.token = tokenRefresh.split(" ")[1];
            if(req.usuario.rol==='admin'){
                req.usuario2 ={}
            }
            next();
          })
      }else{
        jwt.verify(token, SECRET_KEY, (err, decoded)=> {
         if(err || tokenMuertos.includes(token)) return res.status(401).json({ mensaje: "Token inválido"});
       
         req.usuario = {ID: decoded.ID, email: decoded.email, nombre: decoded.nombre, rol: decoded.rol}; // Guarda la info del usuario en la request.
         //req.token = token.split(" ")[1];
         req.token = token;
         next();
       })
      }
    }
            
      //middleware para verificar roles
      const autorizarRol = (roles) => {
        return async (req, res, next) => {
          const usuario = await getUsuario(req.usuario.email);          
          if (!roles.includes(usuario.rol)){
            return res.status(403).json({ Error: 'Acceso no autorizado'});
          }
          next();
        }
      }

      //Se cierra la sesión inhabilitando el token
      app.post("/cierre", async(req,res)=>{
        tokenMuertos.push(req.cookies.token);
        res.clearCookie('token',{
          httpOnly:true,
          secure:true,
          sameSite:'lax',
        })
        loginOk = false;        
        res.json({mensaje: 'Sesion cerrada'});
      });
  
      // guardar juegos favoritos del usuario logueado (con sanitización).
      app.post("/favoritos", verificarToken, body('comentario').isString().trim(), async(req,res)=>{
        
        const errores = validationResult(req);
        if(!errores.isEmpty()) return res.status(400).json({errores: errores.array()});

        const comentarioSeguro = sanitizeHtml(req.body.comentario); //limpia el comentario de posibles inyecciones de código
        const juegoID = req.body.juegoID;
        const estadoID = req.body.estadoID;
        const valoracion = req.body.valoracion;
        const usuarioID = req.usuario.ID;
        
        //si el token es correcto, se guardan los datos ingresados por el usuario, en la BD.
        if(verificarToken){   
          if(await insertFavorito(usuarioID,juegoID,estadoID,valoracion,comentarioSeguro)){
              res.status(200).json({correcto: true});
          }else{
            res.status(406).json({correcto: false, mensaje: "No se pudo agregar"});
          }
        }else{
          res.status(404).json({correcto: false, mensaje: "No hay usuario logueado"});
        }
    })
      
    //Acá se registra el usuario como miembro (usuario estándar).
      app.post("/registro",body('nombre','apellido','email','contrasena').isString().trim(),async(req,res)=>{
        try {
          const datos = req.body;
          const nombre = datos['nombre'];
          const apellido = datos['apellido'];
          const email = datos['email'];
          const password = datos['contrasena'];
          
          const errores = validationResult(req);
          if(!errores.isEmpty()) return res.status(400).json({errores: errores.array()});

          const nombreSano = sanitizeHtml(nombre); 
          const apellidoSano = sanitizeHtml(apellido); 
          const emailSano = sanitizeHtml(email);
          let passwordSano = sanitizeHtml(password)

          const usuarios = await getUsuarios();
          
          let existe = false;
          //Verifica que los campos no estén vacios antes de registrar 
          if(emailSano === '' || nombreSano === '' || apellidoSano === '' || passwordSano === '') 
            return res.status(400).json({error: 'Los datos ingresados no son válidos o están incompletos'});

            //comprueba si el email ingresado ya está registrado
            for(i=0;i<usuarios.length;i++){
              if(usuarios[i].email === emailSano){
                  existe = true;
                  break;
              }else{
                existe = false;
              }
            }
            //Si el email no está registrado, registra al usuario en la base de datos.
            if(!existe){
              passwordSano = await bcryptjs.hash(passwordSano, 8);
              insertUsuario(nombreSano, apellidoSano, emailSano, passwordSano, 'miembro');
              setTimeout(() => {
                res.json({existe:false}); // pasar datos
              }, 1000);            
            }else{
              console.error("El usuario ya existe");
              res.status(400).json({existe:true});
            }     
          
        }catch (error) {
          console.error(error);
         
        }
      });

      //login con sanitización
      app.post("/login",body('email','contrasena').isString().trim(), async(req,res)=>{
          const {email, contrasena} = req.body;
          const errores = validationResult(req);
          if(!errores.isEmpty()) return res.status(400).json({errores : errores.array});
          
          const emailSeguro = sanitizeHtml(email); //limpia el campo de email.
          const contrasenaSegura = sanitizeHtml(contrasena); //limpia el campo de contraseña.
          const usuario = {...await getUsuario(email)};  /*{... } esto sirve para hacer un objeto plano.
                                                           Por ej: ({clave1 : valor1, clave2 : valor2, Etc.}).*/
          if(emailSeguro === '') return res.status(400).json({mensaje: 'El email ingresado no es válido o está vacio'});
          if(contrasenaSegura === '') return res.status(400).json({mensaje: 'La contraseña ingresada no es válida o está vacia'});
       
          if(!usuario.email) return  res.status(401).json({ error: 'El usuario no existe', status : res.statusCode});
          
          if(loginOk) return res.status(401).json({error : 'Ya hay una sesion iniciada, primero cierre la sesion', status : res.statusCode});
    
          bcryptjs.compare(contrasenaSegura, usuario.password, (err,resultado) => {
            //if(contrasena === usuario.password){
            if(err){
              console.error('Ocurrió un error al comparar:',err);
            }else if(resultado){
            // Generar token
            const token = jwt.sign({ ID: usuario.usuarioID, email: emailSeguro, nombre: usuario.nombre + " " + usuario.apellido,rol: usuario.rol }, SECRET_KEY, {
          
              expiresIn: "1h",
            });
            res.cookie('token',token,{
              httpOnly : true,
              secure: true,
              sameSite: 'none'
            });
            console.log('Token generado:',token);

      
            const refreshToken = jwt.sign(usuario, REFRESH_SECRET_KEY);
            //Guardar el refresh token
            refreshTokens.push(refreshToken);

            //Enviar el refresh token en una cookie HTTP-only
            res.cookie("refreshToken", refreshToken, {
              httpOnly: true,               
              secure: true,
              sameSite: 'none',
              maxAge: 7 * 24 * 60 * 60 * 1000, //7 días
            });
           
            loginOk = true;

            res.json({ accessToken : token});
            }else{
              res.status(401).json({ error: "credenciales incorrectas", status: res.statusCode});
            }
          });       
          
      });

      //Ruta protegida. Para ver el perfil es necesario el token.
      app.get("/perfil", verificarToken, async (req,res) =>{
        const query = req.query;
        
        if(!/^[\w\s]+$/.test(query.buscar)){/*comprueba que no se ingresen caracteres 
                                          que pueden ser usados para ejecutar código malicioso.*/
          return res.status(400).send('entrada inválida');
        }

        const juegosFavoritos = await getFavoritos(req.usuario.ID);
        const info = await getInfo();
        let usuario = {usuarioID: req.usuario.ID, nombre: req.usuario.nombre, rol: req.usuario.rol, info: info};
        usuario['favoritos'] = juegosFavoritos;
        res.json({ mensaje: "Perfil autorizado", usuario: usuario});
      });

      //Permite acceder a la sección de admin y verifica que sólo el admin tenga acceso.
      app.get("/admin", verificarToken, autorizarRol(['admin']), async(req,res)=>{
        
        res.status(200).json({mensaje: 'Bienvenido administrador', status: res.statusCode});
      });
      
      //El admin puede acceder a otros perfiles 
      app.post("/admin/perfil",async(req,res)=>{
        const email = req.body.email;

        const emailSano = sanitizeHtml(email);

        const usuario = await getUsuario(emailSano);
        if(!usuario){
          return res.status(404).json({ error: 'Usuario no encontrado',status: res.statusCode});
        }
        const favoritos = await getFavoritos(usuario.usuarioID);
        const info = await getInfo();
        const data = {usuarioID : usuario.usuarioID, nombre: usuario.nombre + " "+ usuario.apellido,rol: usuario.rol,info: info, favoritos: favoritos}
      
        res.status(200).json({ mensaje: 'Usuario encontrado', usuario: data, status: res.statusCode});
      })
      
      //Permite acceder a la sección del gerente y verifica que sólo el gerente y el admin tengan acceso.
      app.get("/gerente",verificarToken, autorizarRol(['admin','gerente']), async(req, res)=>{
        let rol = req.usuario.rol;
        if(rol === 'admin') rol = 'administrador';
        res.status(200).json({mensaje: `Bienvenido ${rol}`, status: res.statusCode});
      })

      /*Permite al admin asignar a un usuario el rol de gerente.
      Se verifica el token y que sólo el admin tenga permiso.*/
      app.post("/admin",verificarToken, autorizarRol(['admin']), async(req,res)=>{
        const email =req.body.email;
        const emailSano = sanitizeHtml(email);
        const usuarios = await getUsuarios();
        
        //Si ya existe un gerente le cambio rol de gerente
        usuarios.forEach(u =>{
            if(u.rol === 'gerente')
              modificarRol(u.usuarioID,'miembro');
        });
                      
        let usuario = await getUsuario(emailSano);
        
        const resultado = await modificarRol(usuario.usuarioID,'gerente');
  
        usuario = await getUsuario(emailSano); //vuelvo a traer los datos del usuario ya actualizados.
        
        if(!resultado) return res.status(404).json({error: 'No se encontró usuario y no se pudo asignar gerente'});
        res.status(200).json({mensaje : `El rol de gerente se asignó correctamente al usuario ${usuario.nombre}`, status:res.statusCode});
      })
         
      //Actualización de favoritos con sanitización
      app.put("/perfil", body('comentario').isString().trim(), async (req, res) => {
        try {
            const errores = validationResult(req);
            if(!errores.isEmpty()) return res.status(400).json({errores: errores.array()});
            
            //evita que al actualizar el comentario se inyecte codigo malicioso.
            comentarioSeguro = sanitizeHtml(req.body.comentario); 

            const usuarioID = req.body.usuarioID;
            if (!usuarioID) {
                return res.status(404).json({ correcto: false, mensaje: "Usuario no encontrado" });
            }

            const { juegoID, estadoID, valoracion } = req.body;
        
            const resultado = await actualizarFavoritos(usuarioID, juegoID, estadoID, valoracion, comentarioSeguro);

            if (resultado) {
                res.status(200).json({ correcto: true });
                console.log("Datos actualizados correctamente")
            } else {
                res.status(500).json({ correcto: false, mensaje: "Error al actualizar favoritos" });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ correcto: false, mensaje: "Error del servidor" });
        }
      });

      //permite borrar un juego de favoritos
      app.delete("/perfil", async(req,res)=>{
          const juegoID = req.body.juegoID;
          const usuarioID = req.body.usuarioID;
          
          if(usuarioID && juegoID){
            await borrarFavorito(usuarioID,juegoID);
            res.status(200).json({correcto:true, mensaje: "Borrado con exito"});
          }else{
            res.status(404).json({correcto:false, mensaje: "No se encontró usuario o juego"});
          }
      })
      
      //Lo utilizo para traducir al español, la descripcion de los juegos que venían en inglés.
      app.post("/traductor",async(req,res)=>{
           const texto = req.query.texto;
           const idiomaDestino = req.query.idioma;
           const traduccion = await traducirTexto(texto,idiomaDestino);
           res.json({traduccion: traduccion});
       })

    
      
}catch(error){
  console.log(error);
}
finally{

  iniciarServidor();

};
  
}

loadData();
