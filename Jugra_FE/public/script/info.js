import {mostrarBotones} from './script.js'
document.addEventListener('DOMContentLoaded', () => { 
    mostrarBotones();   
    mostrarInfo();     
});


function mostrarInfo(){    
    const params = new URLSearchParams(window.location.search);
    console.log(params);
    const jid = params.get('juegoID');
    console.log(jid);
    fetch(`http://localhost:3000/info?juegoID=${jid}`)
    .then(res => res.json())            
    .then(data =>{        
        const seccion_informacion = document.getElementById('informacion-juego');
        console.log(seccion_informacion);
        const divInfo = document.createElement('div');
        divInfo.className = 'bloque-info';
        divInfo.id = 'bloque-info';

        divInfo.innerHTML = `
    <figure class="bloque-imagen" id="bloque-imagen">
        <img src="${data.imagen}" alt="imagen del juego ${data.titulo}" width="200" height="200">
        <figcaption class="descripcion" id="descripcion">${data.descripcion}</figcaption>
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
