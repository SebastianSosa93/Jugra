import Auth from "./auth.js";
import apiRequest from "./request.js";
document.addEventListener('DOMContentLoaded',()=>{
    validarFormulario();
})

function validarFormulario(){
    
   async function cargarDatos() {
        try{
            const data = await apiRequest('http://localhost:3000/perfil');
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

            fetch('http://localhost:3000/login',{
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
                 perfil();
             })
        }) 
}
