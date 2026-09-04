import {mostrarBotones} from './script.js'
import conexion from './conexion.js';

const iniciar = async () => {
    const conexion_datos = await conexion();
    
    mostrarBotones(conexion_datos);   
    mostrarInfo(conexion_datos);  
    traducirTexto(conexion_datos,"","es"); 
};

// Ejecutar ahora mismo si el DOM ya está cargado
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
} else {
    iniciar();
}


async function traducirTexto(conexion_datos, texto, idiomaDestino) {
    try{
        const res = await fetch(`${conexion_datos.servidorBack}/traductor?texto=${texto}&idioma=${idiomaDestino}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ texto, idiomaDestino })
        })
        const data = await res.json();
        console.log(data);
        return data.traduccion;
    }catch(error){
        console.error("Error al traducir el texto:", error);
        return texto; // Devuelve el texto original si hay un error
    }
}


function mostrarInfo(conexion_datos){    
    const params = new URLSearchParams(window.location.search);
    console.log(params);
    const jid = params.get('juegoID');
    console.log(jid);
    // fetch(`${conexion_datos.servidorBack}/info?juegoID=${jid}`)
    fetch(`${conexion_datos.servidorBack}/info?juegoID=${jid}`)
    .then(res => res.json())            
    .then(async data =>{        
        const seccion_informacion = document.getElementById('informacion-juego');
        const idioma = document.getElementById('check-idioma');
        
        const traduccion = await traducirTexto(conexion_datos, data.descripcion, 'es');

        let descripcion = "aquí va la descripción del juego/ here goes the game description";
        if(idioma.checked){
            descripcion = data.descripcion;            
        }else{
            descripcion = traduccion;
        }

        idioma.addEventListener('change', async () => {
            if(idioma.checked){
                descripcion = data.descripcion;            
            }else{
                descripcion = traduccion;
            }
            seccion_informacion.querySelector('.descripcion').textContent = descripcion;            
        })

        console.log(seccion_informacion);
        const divInfo = document.createElement('div');
        divInfo.className = 'bloque-info';
        divInfo.id = 'bloque-info';

        divInfo.innerHTML = `
    <figure class="bloque-imagen" id="bloque-imagen">
        <img src="${data.imagen}" alt="imagen del juego ${data.titulo}" width="200" height="200">
        <figcaption class="descripcion" id="descripcion">${descripcion}</figcaption>
    </figure>

    <section name="enlaces" class="enlaces" id="enlaces">
        <a href="${data.enlace}"> <span> Ir a la pagina del juego</span></a>
    </section>

    <section name="datos-adicionales" class="datos-adicionales" id="datos-adicionales">
        <h2>Datos Adicionales:</h2>
        <ul>
            <li class="imagen-a"><b>Plataforma:</b> ${data.plataforma}</li>
            <li class="imagen-b"><b>Distribuidor:</b> ${data.distribuidor}</li>
            <li class="imagen-c"><b>Desarrollador:</b> ${data.desarrollador}</li>
            <li class="imagen-d"><b>Fecha de lanzamiento:</b>${data.fecha}</li>        
        </ul>
    </section>`;

    seccion_informacion.appendChild(divInfo);
    });
}
