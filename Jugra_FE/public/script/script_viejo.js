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
     
const botonFav = document.querySelectorAll("#btn-favorito");
const formularioFavorito = document.querySelectorAll(".formulario__favorito");
const botonCancelarFavorito = document.querySelectorAll(".btn-cancelar-favorito");

for(let i=0; i<botonFav.length;i++){
    
    botonFav[i].addEventListener('click',e=>{
        function OcultarFormularioFavorito(){
    
            if(formularioFavorito[i].classList.contains('formulario__favorito-activo')){
             
                formularioFavorito[i].classList.remove('formulario__favorito-activo');
                botonCancelarFavorito[i].classList.remove('btn-cancelar-favorito-activo');
            }
        }
        function mostrarFormularioFavorito(){
            formularioFavorito[i].classList.add('formulario__favorito-activo');
            botonCancelarFavorito[i].classList.add('btn-cancelar-favorito-activo');
        }
        fetch("/sesion-abierta")
        .then(response => response.json())
        .then(data =>{
            if(data.loginConfirmado){
                mostrarFormularioFavorito();
            }else{
                alert("Primero hay que ingresar en login");
            }
        })   
             
        botonCancelarFavorito[i].addEventListener('click',()=>{
            formularioFavorito[i].reset();
            OcultarFormularioFavorito();
        })
     
        const juegoID = e.target.getAttribute("data-id");

       
        formularioFavorito[i].addEventListener('submit',(e)=>{
            e.preventDefault();
            
            const estadoID = document.querySelectorAll(".estado-favorito");
            const valoracion = document.querySelectorAll(".valoracion-favorito");
            const comentario = document.querySelectorAll(".comentario-favorito");
            fetch("/favoritos",{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    juegoID: juegoID,
                    estadoID: estadoID[i].value,
                    valoracion: valoracion[i].value,
                    comentario: comentario[i].value
                })
            })
            .then(response => response.json())
            .then(data =>{
                if(data.correcto){
                    console.log("Agregado a favoritos");
                    alert("El juego fue agregado a favoritos");
                }else{
                    console.log(data.mensaje);
                    alert("El juego ya existe en favoritos");
                }
            })
            .finally(()=>{
                formularioFavorito[i].reset();                                
                OcultarFormularioFavorito();
            })
        })
        
        
    });
}


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

const botonEditar = document.querySelectorAll(".btn-editar-perfil");
const formularioEditar = document.querySelectorAll(".formulario__editar-perfil");
if(formularioEditar){
    const botonCancelarEditar = document.querySelectorAll(".btn-cancelar-perfil");
    const botonConfirmarEditar = document.querySelectorAll(".btn-confirmar-perfil");
    const botonEliminarEditar = document.querySelectorAll(".btn-eliminar-perfil");
    const inputEstado =  document.querySelectorAll(".formulario__estado-perfil");
    const inputValoracion =  document.querySelectorAll(".formulario__valoracion-perfil");
    const inputComentario =  document.querySelectorAll(".formulario__comentario-perfil");
    const etiquetaEstado = document.querySelectorAll(".formulario__etiqueta-estado");
    const etiquetaValoracion = document.querySelectorAll(".formulario__etiqueta-valoracion");
    const etiquetaComentario = document.querySelectorAll(".formulario__etiqueta-comentario");
    const estadoPerfil = document.querySelectorAll(".estado-perfil");
    const valoracionPerfil = document.querySelectorAll(".valoracion-perfil");
    const comentarioPerfil = document.querySelectorAll(".comentario-perfil");
    for(let i=0; i<botonEditar.length;i++){

        botonEliminarEditar[i].addEventListener('click',e=>{
            const juegoID = e.target.getAttribute('data-id');
            fetch("/perfil",{
                method: 'DELETE',
                headers:{
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({juegoID: juegoID})
            })
            .then(response => response.json())
            .then(data=>{
                console.log(data.mensaje);
                if(data.correcto){
                    perfil();
                }
            })
        })

        botonEditar[i].addEventListener('click',e=>{
            function OcultarFormularioEditar(){
        
                if(inputEstado[i].classList.contains('formulario__estado-perfil-activo')){
                    inputEstado[i].classList.remove('formulario__estado-perfil-activo');
                }
                if(inputValoracion[i].classList.contains('formulario__valoracion-perfil-activo')){
                    inputValoracion[i].classList.remove('formulario__valoracion-perfil-activo');
                }
                if(inputComentario[i].classList.contains('formulario__comentario-perfil-activo')){
                    inputComentario[i].classList.remove('formulario__comentario-perfil-activo');
                }
                if(botonCancelarEditar[i].classList.contains('btn-cancelar-perfil-activo')){
                    botonCancelarEditar[i].classList.remove('btn-cancelar-perfil-activo');
                }
                if(etiquetaEstado[i].classList.contains('formulario__etiqueta-estado-activo')){
                    etiquetaEstado[i].classList.remove('formulario__etiqueta-estado-activo');
                }
                if(etiquetaValoracion[i].classList.contains('formulario__etiqueta-valoracion-activo')){
                    etiquetaValoracion[i].classList.remove('formulario__etiqueta-valoracion-activo');
                }
                if(etiquetaComentario[i].classList.contains('formulario__etiqueta-comentario-activo')){
                    etiquetaComentario[i].classList.remove('formulario__etiqueta-comentario-activo');
                }
                
                if(botonEliminarEditar[i].classList.contains('btn-eliminar-perfil-oculto')){
                    botonEliminarEditar[i].classList.remove('btn-eliminar-perfil-oculto');
                }
                if(botonEditar[i].classList.contains('btn-editar-perfil-oculto')){
                    botonEditar[i].classList.remove('btn-editar-perfil-oculto');
                }

                if(botonConfirmarEditar[i].classList.contains('btn-confirmar-perfil-activo')){
                    botonConfirmarEditar[i].classList.remove('btn-confirmar-perfil-activo');
                }

                if(estadoPerfil[i].classList.contains('estado-perfil-oculto')){
                    estadoPerfil[i].classList.remove('estado-perfil-oculto');
                }

                if(valoracionPerfil[i].classList.contains('valoracion-perfil-oculto')){
                    valoracionPerfil[i].classList.remove('valoracion-perfil-oculto');
                }

                if(comentarioPerfil[i].classList.contains('comentario-perfil-oculto')){
                    comentarioPerfil[i].classList.remove('comentario-perfil-oculto');
                }
            }

            function mostrarFormularioEditar(){
                inputEstado[i].classList.add('formulario__estado-perfil-activo');
                inputValoracion[i].classList.add('formulario__valoracion-perfil-activo');
                inputComentario[i].classList.add('formulario__comentario-perfil-activo');
                botonCancelarEditar[i].classList.add('btn-cancelar-perfil-activo');
                etiquetaEstado[i].classList.add('formulario__etiqueta-estado-activo');
                etiquetaValoracion[i].classList.add('formulario__etiqueta-valoracion-activo');
                etiquetaComentario[i].classList.add('formulario__etiqueta-comentario-activo');
                
                botonEditar[i].classList.add('btn-editar-perfil-oculto');
                botonEliminarEditar[i].classList.add('btn-eliminar-perfil-oculto');
                estadoPerfil[i].classList.add('estado-perfil-oculto');
                valoracionPerfil[i].classList.add('valoracion-perfil-oculto');
                comentarioPerfil[i].classList.add('comentario-perfil-oculto');
                botonConfirmarEditar[i].classList.add('btn-confirmar-perfil-activo');
            }
            fetch("/sesion-abierta")
            .then(response => response.json())
            .then(data =>{
                if(data.loginConfirmado){
                    mostrarFormularioEditar();
                }else{
                    alert("Primero hay que ingresar en login");
                }
            })   
                
            botonCancelarEditar[i].addEventListener('click',()=>{
                formularioEditar[i].reset();
                OcultarFormularioEditar();
            })
        
            const juegoID = e.target.getAttribute("data-id");
    
            formularioEditar[i].addEventListener('submit',e=>{
                e.preventDefault();
                
                fetch("/perfil",{
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        juegoID: juegoID,
                        estadoID: inputEstado[i].value,
                        valoracion: inputValoracion[i].value,
                        comentario: inputComentario[i].value
                    })
                })
                .then(response => response.json())
                .then(data =>{
                    if(data.correcto){
                        console.log("Agregado a favoritos");
                        alert('Actualizado con exito');
                    }else{
                        console.log(data.mensaje);
                    }
                })
              
                    botonConfirmarEditar[i].addEventListener("click",()=>{
                        formularioEditar[i].submit();                        
                        OcultarFormularioEditar();                        
                    },{once:true});
                
            })

          })
            
    }
   
}