import {mostrarBotones} from "./script.js";
import conexion from "./conexion.js";

const iniciar = async () => {
    const conexion_datos = await conexion();
    mostrarBotones(conexion_datos);
    verificarRegistro(conexion_datos);
};

// Ejecutar ahora mismo si el DOM ya está cargado
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
} else {
    iniciar();
}

async function verificarRegistro(conexion_datos){
        //trabajando con el formulario, verificar y validar.

    //Se obtiene el formulario y los input que contiene.
    const formulario = document.getElementById("formulario");

    if(formulario){
        const inputs = document.querySelectorAll('#formulario input'); 
        //expresiones para restringir los input.
        const expresiones = {
            usuario: /^[a-zA-Z0-9\_\-]{4,16}$/, // Letras, numeros, guion y guion_bajo
            nombre: /^[a-zA-ZÀ-ÿ\s]{1,40}$/, // Letras y espacios, pueden llevar acentos.
            apellido: /^[a-zA-ZÀ-ÿ\s]{1,40}$/, // Letras y espacios, pueden llevar acentos.
            email: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
            contrasena: /^.{4,12}$/, // 4 a 12 digitos.
        }

        const campos = {
            nombre: false,
            apellido:false,
            email: false,
            contrasena: false
        }


        const validarFormulario = (e) =>{
            
            switch(e.target.name){
                case 'campo-nombre':
                    validarCampo(expresiones.nombre,e.target,'nombre');
                break;
                case 'campo-apellido':
                    validarCampo(expresiones.apellido,e.target,'apellido');
                break;
                case 'campo-email':
                    validarCampo(expresiones.email,e.target,'email');
                    
                break;
                case 'campo-contrasena':
                    validarCampo(expresiones.contrasena,e.target,'contrasena');
                break;
            }
        }

        /*Función para validar cada campo según las expresiones. Se cambian los iconos correspondientes 
        y estilo de input, según sea la expresión correcta o incorrecta, también se establecen los campos en 
        verdadero o falso según corresponda*/
        const validarCampo = (expresion,input,campo) =>{
            if(input.value!==""){
                if(expresion.test(input.value)){
                    if(document.getElementById(`grupo__${campo}`).classList.contains('formulario__grupo-incorrecto')){
                        document.getElementById(`grupo__${campo}`).classList.remove('formulario__grupo-incorrecto');
                    }
                    document.getElementById(`grupo__${campo}`).classList.add('formulario__grupo-correcto');
                    if(document.getElementById(`grupo__${campo}`).classList.contains('fa-text-slash')){
                        document.querySelector(`#grupo__${campo} i`).classList.remove('fa-text-slash');
                    }
                    document.querySelector(`#grupo__${campo} i`).classList.add('fa-check');
                    if(document.querySelector(`#grupo__${campo} .formulario__input-error`).classList.contains('formulario__input-error-activo')){
                        document.querySelector(`#grupo__${campo} .formulario__input-error`).classList.remove('formulario__input-error-activo');
                    }
                    campos[campo] = true;
                }else{
                    document.getElementById(`grupo__${campo}`).classList.add('formulario__grupo-incorrecto');
                    if(document.getElementById(`grupo__${campo}`).classList.contains('formulario__grupo-correcto')){
                        document.getElementById(`grupo__${campo}`).classList.remove('formulario__grupo-correcto');
                    }
                    document.querySelector(`#grupo__${campo} i`).classList.add('fa-text-slash');
                    if(document.querySelector(`#grupo__${campo} i`).classList.contains('fa-check')){
                        document.querySelector(`#grupo__${campo} i`).classList.remove('fa-check');
                    }

                    document.querySelector(`#grupo__${campo} .formulario__input-error`).classList.add('formulario__input-error-activo')
                    campos[campo] = false;
                }
            }else{
                if(document.getElementById(`grupo__${campo}`).classList.contains('formulario__grupo-incorrecto')){
                    document.getElementById(`grupo__${campo}`).classList.remove('formulario__grupo-incorrecto');
                }
                if(document.getElementById(`grupo__${campo}`).classList.contains('fa-text-slash')){
                    document.querySelector(`#grupo__${campo} i`).classList.remove('fa-text-slash');
                }
                if(document.querySelector(`#grupo__${campo} .formulario__input-error`).classList.contains('formulario__input-error-activo')){
                    document.querySelector(`#grupo__${campo} .formulario__input-error`).classList.remove('formulario__input-error-activo');
                }
                if(document.getElementById(`grupo__${campo}`).classList.contains('formulario__grupo-correcto')){
                    document.getElementById(`grupo__${campo}`).classList.remove('formulario__grupo-correcto');
                }
                if(document.querySelector(`#grupo__${campo} i`).classList.contains('fa-check')){
                    document.querySelector(`#grupo__${campo} i`).classList.remove('fa-check');
                }
                
                campos[campo] = false;

            }

        }

        inputs.forEach((input)=>{
            input.addEventListener("keyup",validarFormulario); //se activa al soltar una tecla
            input.addEventListener("blur",validarFormulario); //se activa al salir del input
        })
        if(formulario !== null)
        formulario.addEventListener("submit",(e)=>{
            //Previene en caso de que se intenten enviar campos vacios.
            e.preventDefault();
            const valorNombre = document.getElementById('campo-nombre').value;
            const valorApellido = document.getElementById('campo-apellido').value;
            const valorEmail = document.getElementById('campo-email').value;
            const valorContra = document.getElementById('campo-contrasena').value;
            fetch(`https://localhost:${conexion_datos.puerto}/registro`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({nombre: valorNombre, apellido:valorApellido, email : valorEmail, contrasena: valorContra})
            })
            .then(response => response.json())
            .then(data => {
            if (!data.existe) {
                //Asegurarse de que los valores de todos los campos son válidos
                if(campos.nombre && campos.apellido && campos.email && campos.contrasena){    
            
                

                    //Se elimina el mensaje de error y se agrega el mensaje de envio correcto.
                    document.getElementById('formulario__mensaje').classList.remove('formulario__mensaje-activo');
                    document.getElementById('formulario__mensaje-exito').classList.add('formulario__mensaje-exito-activo');
                    
                    //El tiempo que dura el mensaje de envío correcto, en pantalla.
                    setTimeout(()=>{
                        document.getElementById('formulario__mensaje-exito').classList.remove('formulario__mensaje-exito-activo');
                    },3000);
                    setTimeout(()=>{
                        document.location.href = '/login';
                    },3500);

                


                
                }else{
                    //en caso de no ser correctos todos los datos se agrega un mensaje de error.
                    document.getElementById('formulario__mensaje').classList.add('formulario__mensaje-activo');
                }
            }else{
                alert("Ya existe un usuario registrado con ese E-mail");
                formulario.reset();
                    //Se eliminan todos los iconos 
                    document.querySelectorAll('.formulario__grupo-correcto').forEach((icono)=>{
                        icono.classList.remove('formulario__grupo-correcto');
                    })             
                
                  
            }
            });  
        });

    }

}