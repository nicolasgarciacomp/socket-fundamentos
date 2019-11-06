var params = new URLSearchParams(window.location.search);
var nombre = params.get('nombre');
var sala = params.get('sala');
var genero = params.get('genero');

// Referencias de jQuery
var divUsuarios = $('#divUsuarios');
var formEnviar = $('#formEnviar');
var txtMensaje = $('#txtMensaje');
var divChatbox = $('#divChatbox');
var tituloChat = $('#tituloChat');
var salirSala = $('#salirSala');

// Funciones para renderizar usuarios
function renderUsuarios(personas) {
	var html = '';
	var html2 = '';

	html += '<li>';
    html += 	'<a href="javascript:void(0)" class="active"> Chat de <span> '+ params.get('sala') +'</span></a>';
    html += '</li>';

    html2 += '<h3 class="box-title">Sala de chat <small>'+ params.get('sala') +'</small></h3>';

    for(var i = 0; i < personas.length; i++) {
    	var image = 'n';
    	if(personas[i].genero === 'Hombre') {
			image = 'h';
		} else if(personas[i].genero === 'Mujer') {
			image = 'm';
		}
    	html += '<li>';
        html +=		'<a data-id="'+ personas[i].id +'" href="javascript:void(0)"><img src="assets/images/users/'+ image +'.jpg" alt="user-img" class="img-circle"> <span>'+ personas[i].nombre +'<small class="text-success">online</small></span></a>';
    	html += '</li>';
    }

    tituloChat.html(html2);
    divUsuarios.html(html);
}

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
		var image = 'n';
    	if(genero === 'Hombre') {
			image = 'h';
		} else if(genero === 'Mujer') {
			image = 'm';
		}
		html += '<li class="reverse">';
	    html += 	'<div class="chat-content">';
	    html += 		'<h5>'+ mensaje.nombre +'</h5>';
	    html += 		'<div class="box bg-light-inverse">'+ mensaje.mensaje +'</div>';
	    html += 	'</div>';
	    html += 	'<div class="chat-img"><img src="assets/images/users/'+ image +'.jpg" alt="user" /></div>';
	    html += 	'<div class="chat-time">'+ hora +'</div>';
	    html += '</li>';
	} else {
		html += '<li class="animated fadeIn">';
		if(mensaje.nombre !== 'Administrador') {
			html +=     '<div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>';
		}
		html +=     '<div class="chat-content">';
	    html +=     	'<h5>'+ mensaje.nombre +'</h5>';
	    html +=     	'<div class="box bg-light-'+ adminClass +'">'+ mensaje.mensaje +'</div>';
	    html +=     '</div>';
	    html +=     '<div class="chat-time">'+ hora +'</div>';
	    html += '</li>';
	}

    divChatbox.append(html);
}

function scrollBottom() {
    // selectors
    var newMessage = divChatbox.children('li:last-child');
    // heights
    var clientHeight = divChatbox.prop('clientHeight');
    var scrollTop = divChatbox.prop('scrollTop');
    var scrollHeight = divChatbox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatbox.scrollTop(scrollHeight);
    }
}

// Listeners
divUsuarios.on('click', 'a', function() {
	var id = $(this).data('id');
	if(id) {
		console.log(id);
	}
});

salirSala.on('click', function(e) {
	socket.emit('disconnect');
	var url = "https://app-nico-chat.herokuapp.com/"; 
	$(location).attr('href',url);
});

formEnviar.on('submit', function(e) {
	e.preventDefault();
	if(txtMensaje.val().trim().length === 0) {
		return;
	}

	socket.emit('crearMensaje', {
		usuario: nombre,
		mensaje: txtMensaje.val()
	}, function(mensaje) {
		txtMensaje.val('').focus();
		renderMensajes(mensaje, true);
		scrollBottom();
	});
});
