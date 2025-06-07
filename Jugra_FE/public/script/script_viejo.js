document.addEventListener("DOMContentLoaded", ()=> {
    
});
/*Controlando el comportamiento de cada boton "info" en la página para que redireccione a la pagina "/info"
  y asegurar que sea el juego correcto, obteniendo el ID*/
const juegos = document.getElementById("bloque-juegos");
if(juegos){
    const botonInfo = document.querySelectorAll("#btn-infbormacion");
    for(i=0; i<botonInfo.length;i++){
        botonInfo[i].addEventListener('click',e=>{
            console.log("mostrando información del juego");
            const juegoID = e.target.getAttribute("data-id");
            fetch(`/info/${juegoID}`);
            document.location.href = `/info/${juegoID}`;
        })
    }
}
const botonRegristro = document.getElementById("btn-registro");
const botonLogin = document.getElementById("btn-login");
const botonPerfil = document.getElementById("btn-perfil");

fetch("/sesion-abierta")
.then(response => response.json())
.then(data =>{
    if(data.loginConfirmado){
       botonRegristro.classList.add('btn-registro-oculto');
       botonLogin.classList.add('btn-login-oculto');
       if(botonPerfil.classList.contains('btn-perfil-oculto')){
         botonPerfil.classList.remove('btn-perfil-oculto');    
       }

    }else{
        if(botonRegristro.classList.contains('btn-registro-oculto')){
            botonRegristro.classList.remove('btn-registro-oculto');
        }
        if(botonLogin.classList.contains('btn-login-oculto')){
            botonLogin.classList.remove('btn-login-oculto');
        }
        botonPerfil.classList.add('btn-perfil-oculto');        
    }
})   


//redirección a la pagina de inicio.
function inicio(){
    window.location.href = "/juegos";
}
//redirección a la pagina de registro.
function registro(){
    window.location.href = "/registro";
}
//redirección a la pagina de login.
async function login(){
    window.location.href = "/login";
}
//redirección a la pagina de perfil.
function perfil(){
    window.location.href = "/perfil";
}

//controlando el comportamiento del boton cancelar en la página de registro.
const cancelar = document.getElementById("btn-cancelar");
if(cancelar !== null){
    cancelar.addEventListener("click",()=>{
    inicio();
    });
}
//////////////////////////////////////////////////////////////////////////////


function pasarDatos(ruta,metodo,jsonStringify,funcionTrue,funcionFalse){
    fetch(ruta,{
        method: metodo,
        headers: {
            'Content-Type': 'application/json'
        },
        body: jsonStringify
    })
    .then(response => response.json())
    .then(data => {
        if(data){
            funcionTrue();
        }else{
            funcionFalse();
        }
    });
}

function pasarDatosSiExiste(ruta,metodo,jsonStringify,funcionTrue,funcionFalse){
    fetch(ruta,{
        method: metodo,
        headers: {
            'Content-Type': 'application/json'
        },
        body: jsonStringify
    })
    .then(response => response.json())
    .then(existe => {
        if(existe){
            funcionTrue();
        }else{
            funcionFalse();
        }
    });
}

///////////////////Perfil////////////////////////////////

const btnCerrar = document.getElementById("btn-cs");
if(btnCerrar){
    btnCerrar.addEventListener('click',()=>{
        fetch("/cierre",{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({mensaje: "Cierre de sesión"})
        })
        .then(response => response.json())
        .then(data =>{
            if(data.cierre){
    
                login();
            }
        })
        
    });
}

