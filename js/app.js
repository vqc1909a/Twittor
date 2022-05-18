// let url = window.location.href;
// let swLocation = "/twittor/sw.js";

//!Cargar el sw
if (navigator.serviceWorker){
    // if (url.includes("localhost") | url.includes("127.0.0.1")){
    //     swLocation = "/sw.js";
    // }
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js')
        .then(function(reg){
            console.log("service worker registered")
        }).catch(function(err) {
            console.log(err)
        });
    }else{
        console.log("Could not find serviceWorker in navigator")
    }
}

//!Promoviendo la instalación del SW
// Inicializa deferredPrompt para su uso más tarde.
let deferredPrompt;

// window.addEventListener('beforeinstallprompt', (e) => {
//     e.preventDefault();
//     deferredPrompt = e;
//     console.log(deferredPrompt);
// });

// window.addEventListener("load", (e) => {
//   console.log(e);

//   deferredPrompt.prompt();
//   // Wait for the user to respond to the prompt
//   deferredPrompt.userChoice
//     .then((choiceResult) => {
//       if (choiceResult.outcome === 'accepted') {
//         console.log('User accepted the A2HS prompt');
//       } else {
//         console.log('User dismissed the A2HS prompt');
//       }
//       deferredPrompt = null;
//     });
// })

// window.addEventListener('appinstalled', (e) => {
//   app.logEvent('a2hs', 'installed');
// })

//!Aquí se encuentra toda la lógica de la aplicación
// Referencias de jQuery
var titulo      = $('#titulo');
var nuevoBtn    = $('#nuevo-btn');
var salirBtn    = $('#salir-btn');
var cancelarBtn = $('#cancel-btn');
var postBtn     = $('#post-btn');
var avatarSel   = $('#seleccion');
var timeline    = $('#timeline');

var modal       = $('#modal');
var modalAvatar = $('#modal-avatar');
var avatarBtns  = $('.seleccion-avatar');
var txtMensaje  = $('#txtMensaje');

// El usuario, contiene el ID del héroe seleccionado
var usuario;




// ===== Codigo de la aplicación

//!Basicamente me añade un mensaje por encima en la vista del timeline o chat asignandole el mensaje escrito y el personaje seleccionado, una vez hecho esto me cierra automaticamente el modal
function crearMensajeHTML(mensaje, personaje) {

    var content =`
    <li class="animated fadeIn fast">
        <div class="avatar">
            <img src="img/avatars/${ personaje }.jpg">
        </div>
        <div class="bubble-container">
            <div class="bubble">
                <h3>@${ personaje }</h3>
                <br/>
                ${ mensaje }
            </div>
            
            <div class="arrow"></div>
        </div>
    </li>
    `;

    timeline.prepend(content);
    cancelarBtn.click();

}



// Globals
//!Cuando le moguea, lo que me hace es hacer aparecer los dos botones del header, el de la izquierda para regresar y el de la derecha para crear un nnuevo mensaje
//!Me hace aparecer esa vista de chats de los personajes con mensajes => timeline
//!Me oculta la selección de personajes de la pantalla inicial excepto el header
//!También me cambia la imagen del avatar del modal === aparece cunado añades un nuevo mensaje del personaje seleccionado
function logIn( ingreso ) {

    if ( ingreso ) {
        nuevoBtn.removeClass('oculto');
        salirBtn.removeClass('oculto');
        timeline.removeClass('oculto');
        avatarSel.addClass('oculto');
        modalAvatar.attr('src', 'img/avatars/' + usuario + '.jpg');
    } else {
        nuevoBtn.addClass('oculto');
        salirBtn.addClass('oculto');
        timeline.addClass('oculto');
        avatarSel.removeClass('oculto');

        titulo.text('Seleccione Personaje');
    
    }

}


//! Aqui me obtiene el nombre del personaje y lo asigna a usuario y también sobreescribe el texto del titulo
avatarBtns.on('click', function() {

    usuario = $(this).data('user');

    titulo.text('@' + usuario);

    logIn(true);

});

// Boton de salir
//!Basicamente me vuelve a la pantalla inicial de selección de personajes
salirBtn.on('click', function() {
    logIn(false);
});

// Boton de nuevo mensaje
//!Esto me hacer aparace el modal que ocupa toda la vista para añadir un menssaje junto a tres botones debajo qu epor el momento solo funciona el de añadir mensaje
nuevoBtn.on('click', function() {

    modal.removeClass('oculto');
    modal.animate({ 
        marginTop: '-=1000px',
        opacity: 1
    }, 200 );

});

// Boton de cancelar mensaje
//!Este boton es para cerrar el modal y simplemnte me vuelve a la vista del timeline o chat
cancelarBtn.on('click', function() {
   modal.animate({ 
       marginTop: '+=1000px',
       opacity: 0
    }, 200, function() {
        modal.addClass('oculto');
        txtMensaje.val('');
    });
});

// Boton de enviar mensaje
//!Este es el boton para añadir el mensaje del personaje y llevarme a la vista del timeline o chat con el nuevo mensaje añadido
postBtn.on('click', function() {

    var mensaje = txtMensaje.val();
    if ( mensaje.length === 0 ) {
        cancelarBtn.click();
        return;
    }

    crearMensajeHTML( mensaje, usuario );

});