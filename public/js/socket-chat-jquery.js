/**
 * @fileoverview	./public/js/socket-chat-jquery.js
 *
 * @version         1.0
 *
 * @author          Nicolás Garcia <nicolasgarciacomp@gmail.com>
 *
 * History
 * v1.0 – Se creó el archivo
**/

// Declaraciones
var params = new URLSearchParams(window.location.search);
var nombre = params.get('nombre');
var sala = params.get('sala');
var genero = params.get('genero');
var voyATraducir = false;
var idioma = 'en';

// Referencias de jQuery
var divUsuarios = $('#divUsuarios');
var formEnviar = $('#formEnviar');
var txtMensaje = $('#txtMensaje');
var divChatbox = $('#app-mensajes');
var salirSala = $('#salirSala');
var cabecera = $('#cabecera');

/**
 * @name	renderUsuarios
 *
 * @description	Renderiza los usuarios en el panel de usuarios activos
 *
 * @param	{array}
 *
 * @return  {}
**/
function renderUsuarios(personas) {
	var html = '';
	var html2 = '';
	var persOrdenadas = ordenarPorClave(personas, "nombre");

	/*
	html += '<li>';
    html += 	'<a href="javascript:void(0)" class="active"> Chat de <span> '+ params.get('sala') +' ('+ personas.length + ')'+'</span></a>';
	html += '</li>';
	*/

    html2 += '<h3 class="box-title">Sala de chat <small>'+ params.get('sala') +'</small></h3>';

    for(var i = 0; i < personas.length; i++) {
    	var image = 'n';
    	if(persOrdenadas[i].genero === 'Hombre') {
			image = 'h';
		} else if(persOrdenadas[i].genero === 'Mujer') {
			image = 'm';
		}
    	html += '<li class="'+ persOrdenadas[i].id +'" id="'+ persOrdenadas[i].nombre +'">';
        html +=		'<a data-id="'+ persOrdenadas[i].id +'" href="javascript:void(0)"><img src="assets/images/users/'+ image +'.jpg" alt="user-img" class="img-circle"> <span>'+ persOrdenadas[i].nombre +'<small class="text-success">online</small></span></a>';
    	html += '</li>';
    }

    cabecera.html(html2);
    //divUsuarios.html(html);
}

/**
 * @name	renderMensajes
 *
 * @description	Renderiza los mensajes en el panel de mensajes
 *
 * @param	{string, string}
 *
 * @return  {}
**/
function renderMensajes(mensaje, yo) {
	var html = '';
	var fecha = new Date(mensaje.fecha);
	var minutos = fecha.getMinutes();
	if(minutos <= 9) {
		minutos = '0' + minutos;
	}
	var hora = fecha.getHours() + ':' + minutos;
	var adminClass = 'info';

	if(mensaje.nombre === 'Administrador') {
		adminClass = 'danger';
	}

	if(yo) {
		html += '<li class="reverse" style="list-style:none;">';
		html += '<div class="text-right">';
		html += '	<span class="badge badge-primary">'+ mensaje.nombre +'</span>';
		html += '	<p>'+ mensaje.mensaje +'</p>';
		html += '</div>';
	    // html += 	'<div class="chat-img"><img src="assets/images/users/'+ image +'.jpg" alt="user" /></div>';
	    html += '<div class="chat-time text-right">'+ hora +'</div>';
	    html += '</li>';
	} else {
		html += '<li class="animated fadeIn" style="list-style:none;">';
		if(mensaje.nombre !== 'Administrador') {
			// html +=     '<div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>';
		}
		html += '<div>';
		html += '	<span class="badge badge-success">'+ mensaje.nombre +'</span>';
		html += '	<p>'+ mensaje.mensaje +'</p>';
		html += '</div>';
	    html += '<div class="chat-time">'+ hora +'</div>';
	    html += '</li>';
	}

    $(divChatbox).append(html);
}

/**
 * @name	scrollBottom
 *
 * @description	Scroll para los mensajes
 *
 * @param	{}
 *
 * @return  {}
**/
function scrollBottom() {
    // Selectores
    var newMessage = divChatbox.children('li:last-child');
    // Heights
    var clientHeight = divChatbox.prop('clientHeight');
    var scrollTop = divChatbox.prop('scrollTop');
    var scrollHeight = divChatbox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatbox.scrollTop(scrollHeight);
    }
}

salirSala.on('click', function(e) {
	socket.emit('disconnect');
	var url = "https://app-nico-chat.herokuapp.com/"; 
	$(location).attr('href', url);
});

formEnviar.on('submit', function(e) {
	e.preventDefault();
	if(txtMensaje.val().trim().length === 0) {
		return;
	}

	if(voyATraducir) {
		traducir(txtMensaje.val(), idioma)
	  		.then(data => {
	  			socket.emit('crearMensaje', {
					usuario: nombre,
					mensaje: data[0][0][0]
				}, function(mensaje) {
					txtMensaje.val('').focus();
					renderMensajes(mensaje, true);
					scrollBottom();
				});
	  		}); 
	} else {
	  	socket.emit('crearMensaje', {
			usuario: nombre,
			mensaje: txtMensaje.val()
		}, function(mensaje) {
			txtMensaje.val('').focus();
			renderMensajes(mensaje, true);
			scrollBottom();
		});
	}
});

$('#nuevaSala').on('change', function() {
	var nuevaSala = this.value;
	socket.emit('disconnect');
	var url = 'https://app-nico-chat.herokuapp.com/chat.html?nombre='+ nombre +'&sala='+ nuevaSala +'&genero='+ genero +'&terminos=on';
	$(location).attr('href', url);
});

$('#enviaNNick').on('click', function() {
	var nuevoNick = $('#nuevoNick').val();
	socket.emit('disconnect');
	var url = 'https://app-nico-chat.herokuapp.com/chat.html?nombre='+ nuevoNick +'&sala='+ sala +'&genero='+ genero +'&terminos=on';
	$(location).attr('href', url);
});

$('#idioma').on('change', function() {
	idioma = this.value;
	voyATraducir = true;
});

async function traducir(mensaje, idioma) {
	let url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl="+ "auto" + "&tl=" + idioma + "&dt=t&source=bubble&q=" + encodeURI(mensaje);
	let response = await fetch(url);
	let data = await response.json();

	return data;
}

/**
 * @name	ordenarPorClave
 *
 * @description	Ordena los usuarios por orden alfabetico
 *
 * @param	{array, number}
 *
 * @return  {array}
**/
function ordenarPorClave(array, key) {
    return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}
