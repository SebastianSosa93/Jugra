import conexion from "./conexion.js";
import Auth from "./auth.js";
import apiRequest from "./request.js";
import {mostrarBotones} from "./script.js";

 const iniciar = async () => {
    const conexion_datos = await conexion();
    mostrarBotones(conexion_datos);
    validarFormulario(conexion_datos);
};

// Ejecutar ahora mismo si el DOM ya está cargado
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
} else {
    iniciar();
}

function validarFormulario(conexion_datos){
    
   async function cargarDatos() {
        try{
            const data = await apiRequest(`${conexion_datos.servidorBack}/perfil`);
            
        }catch(error){
            console.error('Error al obtener los datos', error);
        }
    }

    const formularioLogin = document.getElementById("formulario__login");

    if(!formularioLogin) return console.error('error al intentar acceder al formulario');

        formularioLogin.addEventListener("submit",(e)=> {
            e.preventDefault();
            const email = document.getElementById("login-campo-email");
            const contrasena = document.getElementById("login-campo-contrasena");

            fetch(`${conexion_datos.servidorBack}/login`,{
                method: 'POST',
                credentials:'include',
                headers: {'Content-Type':'application/json'
                },
                body: JSON.stringify({email: email.value, contrasena: contrasena.value})
            })
            .then(res => res.json())
            .then(data => {
                if(data.status === 401){
                    console.log(data.error);
                    alert(data.error);
                    email.value = '';
                    contrasena.value = '';
                }else if (data.status === 400){
                    console.log(data.mensaje);
                    alert(data.mensaje);
                    email.value = '';
                    contrasena.value = '';
                }
                else{
                    console.log('Usuario aceptado');
                   
                    Auth.setToken(data.accessToken);
                                    
                    cargarDatos();
                    document.location.href = '/perfil';
                }
            })
             .then(()=>{
               
             })
        }) 
}
