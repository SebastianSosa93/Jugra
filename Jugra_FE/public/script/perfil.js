document.addEventListener('DOMContentLoaded',()=>{
    mostrarPerfil();
});

function mostrarPerfil(){
    
    fetch('http://localhost:3000/perfil',{
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
         
    })    
}