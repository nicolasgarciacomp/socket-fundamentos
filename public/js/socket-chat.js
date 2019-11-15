var socket = io();

var params = new URLSearchParams(window.location.search);

if(!params.has('nombre') || !params.has('sala')) {
	window.location = 'index.html';
	throw new Error('El nombre y la sala son necesario');
}

var usuario = {
	nombre: params.get('nombre'),
	sala: params.get('sala'),
	genero: params.get('genero')
};

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
	// console.log(personas);
	renderUsuarios(personas);
});

// Mensajes privados
socket.on('mensajePrivado', function(mensaje) {
	$('#'+mensaje.nombre+'').css('background-color', '#FF4000')
	$('#'+mensaje.nombre+' span').css('color', 'white');
	console.log('Mensaje Privado: ', mensaje);
});
