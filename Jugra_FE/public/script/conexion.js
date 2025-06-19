const conexion = async () => {
    try {
        const res = await fetch('https://localhost:3000/config');
        const config = await res.json();
        return { puerto: config.puerto, servidor: config.servidor };
    } catch (error) {
        console.error('Error obteniendo configuración:', error);
        return null;
    }
};

export default conexion;