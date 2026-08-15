const conexion = async () => {
   let noConexion = false;
    try {
        const res = await fetch('https://jugra2.onrender.com/config');

        const config = await res.json();
    
        return { puerto: config.puerto, servidorFront: config.servidorFront, servidorBack:config.servidorBack };
    } catch (error) {
        console.error('Error obteniendo configuración:', error);
        noConexion = true;
    }

    if(noConexion){
        try {    
        return { puerto: 3001, servidorFront: "http://127.0.0.1:3000", servidorBack:"http://localhost:3001" };
    } catch (error) {
        console.error('Error obteniendo configuración:', error);
        return null;
    }   
    }
};

export default conexion;