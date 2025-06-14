import {mostrarBotones} from "./script.js";
import {port} from "./conexion.js";
document.addEventListener('DOMContentLoaded',()=>{
    mostrarBotones();
    mostrarPerfil();
});

function mostrarPerfil(){
    const refresh = (booleano) => window.location.reload(booleano);
    fetch(`https://localhost:${port}/perfil`,{
        method:'GET',
        credentials:'include',
        headers:{'Content-Type': 'application/json'}        
    })
    .then(res => res.json())
    .then(data => {
        console.log(data);

        const bloque_titulo = document.getElementById('bloque-titulo'); //header
        const contenedor = document.getElementById('contenedor-juegos-perfil')  
        const juegosFavoritos = data.usuario.favoritos;
        const informacion = data.usuario.info;
        const usuarioID = data.usuario.usuarioID;
        const btn_inicio = document.getElementById('btn-inicio');
        const btn_cs = document.getElementById('btn-cs');
        
        btn_inicio.classList.remove('btn-inicio-oculto');
        btn_cs.classList.remove('btn-cs-oculto');



        bloque_titulo.innerHTML = `<h1 id="titulo" class="perfil__titulo">Perfil de ${data.usuario.nombre}</h1>`;

        juegosFavoritos.forEach(favorito => {
            const div = document.createElement('div');
            let info = informacion.find(info => info.juegoID === favorito.juegoID);
            div.id = 'bloque-favorito';
            div.class= 'bloque-favorito';
            div.innerHTML =
             `
             <form method="put" class="formulario__editar-perfil" id="formulario__editar-perfil">
                            <!--Bloque de Juego -->
            <div class="bloque-juego-perfil" id="bloque-juego-perfil">                
                <p class="juego-perfil" id="juego-perfil"><b>Titulo:</b> ${favorito.titulo}</p>
                <figure class=imagen__perfil>
                   <img src=${info.imagen} alt="imagen del juego" id='imagen-perfil' class=imagen__perfil>
                </figure>
                            <!-- bloque de estado y valoracion -->
                <div class="bloque-datos-perfil" id="bloque-datos-perfil">
             
                    <div class="bloque-estado-perfil" id="bloque-estado-perfil">
                        <p class="estado-perfil" id="estado-perfil"><b>Estado:</b> ${favorito.tipoEstado}</p>
                           <!-- estado -->
                        <div class="formulario__grupo-favorito" id="grupo__favorito-estado">
                            <label for="formulario__estado-perfil" class="formulario__etiqueta-estado formulario" id="formulario__etiqueta-estado">Estado</label>
                            <select name="estado" class="formulario__estado-perfil" id="formulario__estado-perfil">
                                <option value="1">Jugado</option>
                                <option selected value="2">No jugado</option>
                                <option value="3">Terminado</option>
                            </select>
                        </div>    
                        <div class="bloque-valoracion-perfil" id="bloque-valoracion-perfil">
                            <p class="valoracion-perfil" id="valoracion-perfil"><b>Valoracion:</b> ${favorito.valoracion}</p>
                            <!-- valoracion-->
                            <div class="formulario__grupo-favorito" id="grupo__favorito-valoracion">
                                <label for="formulario__valoracion-perfil" class="formulario__etiqueta-valoracion" id="formulario__etiqueta-valoracion">Valoración</label>
                                <input name="valoracion" type="number" class="formulario__valoracion-perfil" id="formulario__valoracion-perfil" min="1" max="10">
                            </div>
                        </div>                    
                                        <!-- bloque de comentario -->
                        <div class="bloque-comentario-perfil" id="bloque-comentario-perfil">
                            <p class="comentario-perfil" id="comentario-perfil"><b>Comentario:</b> ${favorito.comentario}</p>
                                        <!-- comentario -->
                                <div class="formulario__grupo-favorito" id="grupo__favorito-comentario">
                                    <label for="formulario__comentario-perfil" class="formulario__etiqueta-comentario" id="formulario__etiqueta-comentario">Comentario</label>
                                    <input name="comentario"  type="text" class="formulario__comentario-perfil" id="formulario__comentario-perfil">
                                </div>
                                
                            <button class="btn-confirmar-perfil" id="btn-confirmar-perfil">Confirmar</button>
                            
                            <button class="btn-cancelar-perfil" id="btn-cancelar-perfil">Cancelar</button> 
                        </div>
                    </div>  
                </div>
                                
            </div>
            </form>
            <button class="btn-editar-perfil" id="btn-editar-perfil" data-id="${favorito.juegoID}">Editar</button>
            <button class="btn-eliminar-perfil" id="btn-eliminar-perfil" data-id="${favorito.juegoID}">Eliminar</button>
        `
        contenedor.appendChild(div);
        })
         
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
                    fetch(`https://localhost:${port}/perfil`,{
                        method: 'DELETE',
                        headers:{
                            'Content-Type':'application/json'
                        },
                        body: JSON.stringify({juegoID: juegoID, usuarioID: usuarioID})
                    })
                    .then(response => response.json())
                    .then(data=>{
                        console.log(data.mensaje);
                        if(data.correcto){
                            refresh(true);
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
                      fetch(`https://localhost:${port}/login`)
                      .then(res => {
                        if(res.status === 200){
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
                        
                        fetch(`https://localhost:${port}/perfil`,{
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                usuarioID: usuarioID,
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
                                OcultarFormularioEditar();       
                                refresh(true);
                            }else{
                                console.log(data.mensaje);
                            }
                        })
                                           
                    })

                })
                    
            }
        
        }
    })    
}