import {mostrarBotones} from "./script.js";
import conexion from "./conexion.js";

const iniciar = async () => {
    const conexion_datos = await conexion();
    mostrarBotones(conexion_datos);
    mostrarPerfil(conexion_datos);
};

// Ejecutar ahora mismo si el DOM ya está cargado
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
} else {
    iniciar();
}

function mostrarPerfil(conexion_datos){
    const refresh = (booleano) => window.location.reload(booleano);
    fetch(`https://localhost:${conexion_datos.puerto}/perfil`,{
        method:'GET',
        credentials:'include',
        headers:{'Content-Type': 'application/json'}        
    })
    .then(res => res.json())
    .then(async data => {

        const bloque_titulo = document.getElementById('bloque-titulo'); //header
        const contenedor = document.getElementById('contenedor-juegos-perfil')  
        let nombre = data.usuario.nombre;
        let juegosFavoritos = data.usuario.favoritos;
        let informacion = data.usuario.info;
        let usuarioID = data.usuario.usuarioID;
        const btn_inicio = document.getElementById('btn-inicio');
        const btn_cs = document.getElementById('btn-cs');
        
        btn_inicio.classList.remove('btn-inicio-oculto');
        btn_cs.classList.remove('btn-cs-oculto');

        let adminOK = false;


        await fetch(`https://localhost:${conexion_datos.puerto}/admin`,{
            method : 'GET',
            credentials : 'include',
            headers : {'Content-Type' : 'application/json'},
        })
        .then(respuesta => respuesta.json())
        .then(admin => {
            if(admin.status === 200){
                 adminOK = true;
                 bloque_titulo.innerHTML = `<h1 id="titulo" class="perfil__titulo">Bienvenido administrador: ${nombre}</h1>`;
            }            
        })

        await fetch(`https://localhost:${conexion_datos.puerto}/gerente`,{
            method: 'GET',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'}, 
        })
        .then(respuesta => respuesta.json())
        .then(gerente =>{
            if(gerente.status === 200){
                bloque_titulo.innerHTML = `<h1 id="titulo" class="perfil__titulo"> ${gerente.mensaje}`;
            }
        });
   function verOtroPerfil(){     
        const divMensaje = document.createElement('div');
        divMensaje.id = 'mensaje_titulo';
        divMensaje.name = 'mensaje_titulo';
        divMensaje.class = "perfil_titulo";
        
        divMensaje.innerHTML = `<h2 id="titulo" class="perfil__titulo">Perfil de ${nombre}</h2>
                                <button aria-pressed='false' name="btn-op" id="btn-op" class="btn-admin">OTRO PERFIL</button>
                                <button aria-pressed='false' name="btn-ag" id="btn-ag" class="btn-admin">ASIGNAR GERENTE</button>
                                `;
        bloque_titulo.append(divMensaje);
        
        const btn_otroPerfil = document.getElementById('btn-op');
        const contenedor_form_op = document.createElement('section');
        const formulario_op = document.createElement('form');
        const btn_asignarGerente = document.getElementById('btn-ag');
        const contenedor_form_ag = document.createElement('section');
        const formulario_ag = document.createElement('form');

        if(!adminOK){
            if(!btn_otroPerfil.classList.contains('btn-admin-oculto'))
                btn_otroPerfil.classList.add('btn-admin-oculto');
            if(!btn_asignarGerente.classList.contains('btn-admin-oculto'))
                btn_asignarGerente.classList.add('btn-admin-oculto');
        }else{
            if(btn_otroPerfil.classList.contains('btn-admin-oculto'))
                btn_otroPerfil.classList.remove('btn-admin-oculto');
            if(btn_asignarGerente.classList.contains('btn-admin-oculto'))
                btn_asignarGerente.classList.remove('btn-admin-oculto');
        }
        contenedor_form_op.id = 'contenedor-form-op';
        contenedor_form_op.classList.add('contenedor-form-op','contenedor-form-op-oculto');
        
        formulario_op.id = 'form-op';
        formulario_op.class = 'form-op';

        formulario_op.action = '/perfil';
        formulario_op.method = 'POST';
        formulario_op.innerHTML = `<label for= 'campo_email_op'>Email de usuario</label>
                                    <input type='email' name='email_usuario' id='campo_email_op' class= 'campo-email-op' placeholder='ver el perfil de un usuario'>
                                    <input type='submit' id='btn-ingresar-op' class='btn-ingresar-op' value = 'INGRESAR'>
                                    `;
        contenedor_form_op.append(formulario_op);       
        bloque_titulo.append(contenedor_form_op);         
        
        contenedor_form_ag.id = 'contenedor-form-ag';
        contenedor_form_ag.classList.add('contenedor-form-ag','contenedor-form-ag-oculto');
        
        formulario_ag.id = 'form-ag';
        formulario_ag.class = 'form-ag';

        formulario_ag.action = '/perfil';
        formulario_ag.method = 'POST';
        formulario_ag.innerHTML = `<label for= 'campo_email_ag'>Asignar a email: </label>
                                    <input type='email' name='email_usuario_gerente' id='campo_email_ag' class= 'campo-email-ag' placeholder='Asignar un gerente'>
                                    <input type='submit' id='btn-ingresar-ag' class='btn-ingresar-ag' value = 'INGRESAR'>
                                    `;
        contenedor_form_ag.append(formulario_ag);       
        bloque_titulo.append(contenedor_form_ag);      

        btn_otroPerfil.addEventListener('click',()=>{
            if(btn_otroPerfil.getAttribute('aria-pressed') === 'false'){            
                btn_otroPerfil.setAttribute('aria-pressed','true');
                if(contenedor_form_op.classList.contains('contenedor-form-op-oculto')){
                    contenedor_form_op.classList.remove('contenedor-form-op-oculto');
                }
            
            }else{
                btn_otroPerfil.setAttribute('aria-pressed','false');
                if(!contenedor_form_op.classList.contains('contenedor-form-op-oculto')){
                    contenedor_form_op.classList.add('contenedor-form-op-oculto');
                }
            }
            
        })

        btn_asignarGerente.addEventListener('click',()=>{
            if(btn_asignarGerente.getAttribute('aria-pressed') === 'false'){            
                btn_asignarGerente.setAttribute('aria-pressed','true');
                if(contenedor_form_ag.classList.contains('contenedor-form-ag-oculto')){
                    contenedor_form_ag.classList.remove('contenedor-form-ag-oculto');
                }
            
            }else{
                btn_asignarGerente.setAttribute('aria-pressed','false');
                if(!contenedor_form_ag.classList.contains('contenedor-form-ag-oculto')){
                    contenedor_form_ag.classList.add('contenedor-form-ag-oculto');
                }
            }
            
        })
    
        formulario_op.addEventListener('submit',(e)=>{
            e.preventDefault();
            const email_usuario = document.getElementById('campo_email_op');
            fetch(`https://localhost:${conexion_datos.puerto}/admin/perfil`,{
                method:'POST',
                credentials:'include',
                headers:{'Content-Type':'application/json'},
                body: JSON.stringify({email: email_usuario.value})                                
            })
            .then(res => res.json())
            .then(async dataNueva =>{
                if(dataNueva.status === 200){
                    
                    console.log('usuario encontrado');
                    juegosFavoritos = dataNueva.usuario.favoritos;
                    
                    informacion = dataNueva.usuario.info;
                    
                    usuarioID = dataNueva.usuario.usuarioID;
                    
                    nombre = dataNueva.usuario.nombre;
                    
                    bloque_titulo.innerHTML= '';
                 
                    contenedor.innerHTML = '';

                      verOtroPerfil();
                }else{
                    console.log('Error: usuario no existe');
                    alert(dataNueva.error);
                }
            });


        });

          formulario_ag.addEventListener('submit',(e)=>{
            e.preventDefault();
            const email_usuario = document.getElementById('campo_email_ag');
            fetch(`https://localhost:${conexion_datos.puerto}/admin`,{
                method:'POST',
                credentials:'include',
                headers:{'Content-Type':'application/json'},
                body: JSON.stringify({email: email_usuario.value})                                
            })
            .then(res => res.json())
            .then(gerente =>{
                if(gerente.status === 200){
                    alert('Gerente asignado');

                }else{
                    console.log('Error: gerente no fue asignado');
                    alert(gerente.error);
                }
            });


        });
  
  

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
                    fetch(`https://localhost:${conexion_datos.puerto}/perfil`,{
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

                      fetch(`https://localhost:${conexion_datos.puerto}/login`)
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
                        
                        fetch(`https://localhost:${conexion_datos.puerto}/perfil`,{
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
    }
    verOtroPerfil();
    })    

}