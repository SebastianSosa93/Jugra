const conexion = async () => {
    try {
        const res = await fetch('https://jugra2.onrender.com/config');
        const config = await res.json();
        return { puerto: config.puerto, servidorFront: config.servidorFront, servidorBack:config.servidorBack };
    } catch (error) {
        console.error('Error obteniendo configuración:', error);
        return null;
    }
};

export default conexion;