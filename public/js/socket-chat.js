/**
 * @fileoverview	./public/js/socket-chat.js
 *
 * @version         1.0
 *
 * @author          Nicolás Garcia <nicolasgarciacomp@gmail.com>
 *
 * History
 * v1.0 – Se creó el archivo
**/

// Definiciones
var socket = io();
var params = new URLSearchParams(window.location.search);

// Controlo que haya datos de nombre y sala
if(!params.has('nombre') || !params.has('sala')) {
	window.location = 'index.html';
	throw new Error('El nombre y la sala son necesario');
}

// Paso datos de usuario nuevo
var usuario = {
	nombre: params.get('nombre'),
	sala: params.get('sala'),
	genero: params.get('genero')
};

// Connect
socket.on('connect', function() {
	console.log('Conectado al servidor');

	socket.emit('entrarChat', usuario, function(resp) {
		// console.log('Usuarios conectados: ', resp);
		renderUsuarios(resp);
	});
});

// Escuchar
socket.on('disconnect', function() {
	console.log('Perdimos conexión con el servidor');
});

/*
// Enviar información
socket.emit('crearMensaje', {
	usuario: 'Nicolas',
	mensaje: 'Hola que tal?'
}, function(resp) {
	console.log('Respuesta Server: ', resp);
});
*/

// Escuchar información
socket.on('crearMensaje', function(mensaje) {
	renderMensajes(mensaje, false);
	scrollBottom();
});

// Escuchar cambios de usuarios | entrar - salir |
socket.on('listaPersona', function(personas) {
	renderUsuarios(personas);
});

// Mensajes privados
socket.on('mensajePrivado', function(mensaje) {
	$('#'+mensaje.nombre+'').css('background-color', '#FF4000')
	$('#'+mensaje.nombre+' span').css('color', 'white');
	console.log('Mensaje Privado: ', mensaje);
});
