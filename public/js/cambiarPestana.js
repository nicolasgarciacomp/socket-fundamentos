/**
 * @fileoverview    ./public/js/pestanas.chat.js
 *
 * @version         1.0
 *
 * @author          Nicolás Garcia <nicolasgarciacomp@gmail.com>
 *
 * History
 * v1.0 – Se creó el archivo
**/

/* Dada la division que contiene todas las pestañas y la de la pestaña que se 
   quiere mostrar, la funcion oculta todas las pestañas a excepcion de esa */
function cambiarPestana(pestanas, id) {
    
    // Obtiene los elementos con los identificadores pasados
    var pestana = document.getElementById(id.id);
    var listaPestanas = document.getElementById(pestanas.id);
    
    // Obtiene las divisiones que tienen el contenido de las pestañas
    var cpestana = document.getElementById('c'+id.id);
    var listacPestanas = document.getElementById('contenido'+pestanas.id);
    
    var i = 0;
    // Recorre la lista ocultando todas las pestañas y restaurando el fondo y el padding de las pestañas.
    while(typeof listacPestanas.getElementsByTagName('div')[i] != 'undefined') {
        $(document).ready(function() {
            $(listacPestanas.getElementsByTagName('div')[i]).css('display', 'none');
            $(listaPestanas.getElementsByTagName('li')[i]).css('background', '');
            $(listaPestanas.getElementsByTagName('li')[i]).css('padding-bottom', '');
        });
        i += 1;
    }

    for(var i = 0; i < 100; i++) {
        $(listacPestanas.getElementsByTagName('ul')[i]).css('display', 'none');
    }

    $(document).ready(function() {
        /* Muestra el contenido de la pestaña pasada como parametro a la funcion,
           cambia el color de la pestaña y aumenta el padding para que tape el  
           borde superior del contenido que esta juesto debajo y se vea de este 
           modo que esta seleccionada */
        $(cpestana).css('display', '');
        $(pestana).css('background', 'dimgray');
        $(pestana).css('padding-bottom', '2px'); 
    });
}
