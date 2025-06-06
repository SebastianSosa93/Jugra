import Auth from "./auth.js";
import apiRequest from "./request.js";

const servidor = "http://localhost:8080";

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

async function mostrarBotones(){
    const btn_inicio = document.getElementById('btn-inicio');
    const btn_registro = document.getElementById('btn-registro');
    const btn_login = document.getElementById('btn-login');
    const btn_perfil = document.getElementById('btn-perfil');
    const btn_cs = document.getElementById('btn-cs');
    const btn_cancelar = document.getElementById("btn-cancelar");
    
    if(btn_cancelar){
        btn_cancelar.addEventListener('click',()=>{
             inicio();
        })
    }

    if(btn_inicio){
        btn_inicio.addEventListener('click',()=>{
            inicio();
        })
    }

    if(btn_registro){
        btn_registro.addEventListener('click',()=>{
            registro();
        });
    }

    if(btn_login){
        btn_login.addEventListener('click',()=>{
            login();
        });
    }

    if(btn_perfil){
        btn_perfil.addEventListener('click',()=>{
            perfil();
        });
    }

    if(btn_cs){
        btn_cs.addEventListener('click',()=>{
            cierre();
        });
    }

    
    //consulto si es posible acceder al perfil. En caso de no poder (codigo 404),
    //se ocultan los botones que no deberían ser visibles para un usuario no logueado.
    //En caso contrario, se muestra el boton de perfil, inicio y cierre, se ocultan los demás. 

    if(!(document.location.href === servidor + "/" || document.location.href === servidor + "/perfil")) return;
    fetch('http://localhost:3000/login')
    .then(res => {
      
        if(res.status === 404){
            btn_perfil.classList.add('btn-perfil-oculto');
            btn_cs.classList.add('btn-cs-oculto');
        }else{
            if(btn_perfil.classList.contains('btn-perfil-oculto')){
                btn_perfil.classList.remove('btn-perfil-oculto');
            }
            if(btn_cs.classList.contains('btn-cs-oculto')){
                btn_cs.classList.remove('btn-cs-oculto');
            }
            btn_login.classList.add('btn-login-oculto');
            btn_registro.classList.add('btn-registro-oculto');
        }
    });    
    
}

//redirección a la pagina de inicio.
function inicio(){
    window.location.href = '/'
    // mostrarInicio();
    // const orden = document.getElementById('ordenar');
    // orden.value = 'id'; //elige la opcion con el nombre 'id'. También se puede usar: orden.selectedIndex = 0;
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

//cierre de sesión y redirección al inicio.
function cierre(){
    fetch('http://localhost:3000/cierre',{
        method:'POST',
        credentials:'include',
        headers:{'Content-Type':'application/json'}
    })
    .then(()=>{
        inicio();
    });        
}

//controlando el comportamiento del boton cancelar 
function cancelar(){
    window.history.back();
}

export default (mostrarBotones);