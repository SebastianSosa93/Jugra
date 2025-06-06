import mostrarBotones from "./script.js";

document.addEventListener('DOMContentLoaded', () => { 
    mostrarBotones();
    mostrarInicio();  
    ordenar();
    irPerfil();
});

  

function mostrarInicioConDatos(data){
    const juegos = data.juegos;
    const informacion = data.informacion;
    const bloque = document.getElementById('bloque-lista');
    
    bloque.innerHTML = ''; // Limpiar juegos anteriores
    
    juegos.forEach(juego => { 
        let info = informacion.find(info => info.juegoID === juego.juegoID);
        if(!info) return; //saltear si no hay info
        
        const div = document.createElement('div');
        div.className = 'bloque-juego';
        div.id = 'bloque-juego';
        
        div.innerHTML = `
            <p name="juego-nombre" class= 'titulo-juego' id="titulo-juego"> ${juego.titulo}</p>
            <div name="bloqueId" id="bloqueId">
                <span name="juegoID" id="juegoID"> ${juego.juegoID} </span>
                <figure class="bloque-imagen-inicio" id="bloque-imagen-inicio">
                    <img src="${info.imagen}" alt="imagen del juego ${juego.titulo}" id="imagen_juego" class= "imagen_juego" >                
                </figure>
                
            </div>
            <button name="btn-informacion" class="btn-informacion" data-id= "${juego.juegoID}"> Info </button> 
            <button name="btn-favorito" id="btn-favorito" data-id="${juego.juegoID}"> Favorito </button>
            <form class="formulario__favorito" id="formulario__favorito" action="/favoritos" method="post">
                <div class="formulario__grupo-favorito" id="grupo__favorito-estado">
                    <label for="estado-favorito" class="etiqueta-estado" id="etiqueta-estado">Estado</label>
                    <select class="estado-favorito" id="estado-favorito" data-id="${juego.juegoID}">
                        <option value="1">Jugado</option>
                        <option selected value="2">No jugado</option>
                        <option value="3">Terminado</option>
                    </select>
                </div>
                <div class="formulario__grupo-favorito" id="grupo__favorito-valoracion">
                    <label for="valoracion-favorito" class="etiqueta-valoracion" id="etiqueta-valoracion">Valoración</label>
                    <input type="number" data-id="${juego.juegoID}" class="valoracion-favorito" id="valoracion-favorito" min="1" max="10">
                </div>
                <div class="formulario__grupo-favorito" id="grupo__favorito-comentario">
                    <label for="comentario-favorito" class="etiqueta-comentario" id="etiqueta-comentario">Comentario</label>
                    <input type="text" class="comentario-favorito" id="comentario-favorito" data-id="${juego.juegoID}">
                </div>
                <input type="submit" value="Confirmar" class="btn-confirmar-favorito" id="btn-confirmar-favorito" data-id="${juego.juegoID}">
            </form>
            <button class="btn-cancelar-favorito" id="btn-cancelar-favorito" data-id="${juego.juegoID}"> Cancelar </button>
        `;
        
        bloque.appendChild(div);
    });
    const botonInfo = document.querySelectorAll(".btn-informacion");
    console.log(botonInfo.length);

    for(let i=0; i<botonInfo.length;i++){
        botonInfo[i].addEventListener('click',e=>{                
            console.log("mostrando información del juego");
            const juegoID = e.target.getAttribute("data-id");
            console.log(juegoID);
            window.location.href = `/info?juegoID=${juegoID}`;   
        });
    }
       
}

function mostrarInicio(){
    fetch('http://localhost:3000/juegos?orden=juegoID')
        .then(res => res.json())
        .then(mostrarInicioConDatos);
}

function ordenar(){
   const etiqueta = document.getElementById("etiqueta");
   const orden = document.getElementById("ordenar");
    
    // Escuchar cambios en el select y actualizar el texto del label y redirigir
    
    if(orden !== null) {
        orden.addEventListener("change", () => {
         const mapaOrden = {
            id: 'juegoID',
            nombre: 'titulo'
         };
        const ordenElegido = mapaOrden[orden.value];
            
        console.log(ordenElegido);
        pasarDatos("http://localhost:3000/juegos", 'PUT', JSON.stringify({orden: ordenElegido}), () => {
            fetch(`http://localhost:3000/juegos?orden=${ordenElegido}`)
            .then(res => res.json())
            .then(mostrarInicioConDatos);       
            
            etiqueta.textContent = "Ordenado ";
            }, () => {
                console.error("No se pudo aplicar el orden");
            });
        });
    }      
}  
   
async function irPerfil(){
    const btn_perfil = document.getElementById('btn-perfil');
    btn_perfil.addEventListener('click',()=>{    
      fetch('http://localhost:3000/login')
      .then(data => {
            if(data.status===404){
                alert('No se puede acceder al perfil sin estar logueado');
            }else{
                 perfil();
            }
       })
       
    })
    
}