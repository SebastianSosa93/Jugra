import {port} from "./conexion.js";
import Auth from "./auth.js";
import apiRequest from "./request.js";
import {mostrarBotones} from "./script.js";
document.addEventListener('DOMContentLoaded',()=>{
    mostrarBotones();
    validarFormulario();
})

function validarFormulario(){
    
   async function cargarDatos() {
        try{
            const data = await apiRequest(`https://localhost:${port}/perfil`);
            console.log('Datos protegidos', data);            
            
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

            fetch(`https://localhost:${port}/login`,{ //el valor de port es 8443
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
                }else if (data.status === 400){
                    console.log(data.mensaje);
                    alert(data.mensaje);
                }
                else{
                    console.log('Usuario aceptado');
                   
                    Auth.setToken(data.accessToken);
                                    
                    cargarDatos();
                }
            })
             .then(()=>{
                 document.location.href = '/perfil';
             })
        }) 
}
