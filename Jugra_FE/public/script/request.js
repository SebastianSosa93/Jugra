import Auth from "./auth.js";

async function apiRequest(url, options = {}) {
    if(!options.headers) options.headers = {};
    const token = await Auth.getToken();
    if(token){
        options.headers['Authorization'] = `Bearer ${token}`
    }
      options.credentials = 'include';

    let response = await fetch(url, options);

    //si el token expira, se intenta refrescar
    if(response.status === 401){
        console.log('Token expirado, intentando refrescar...');

        const newToken = await Auth.refreshToken();
        if(newToken){
            options.headers['Authorization'] = `Bearer ${newToken}`;
            response = await fetch(url, options); //reintenta la solicitud con el token nuevo.
        }else{
            console.log('Sesion expirada, redirigiendo al login...');
            login();
            //window.location.href = '/login'; //redirigir al login si hay un fallo.
        }
    }

    return response.json();
} 

export default apiRequest;