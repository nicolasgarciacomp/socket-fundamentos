const { io } = require('../server.js');

io.on('connection', (client) => {

	console.log('Usuario conectado');

	client.emit('enviarMensaje', {
		usuario: 'Admin',
		mensaje: 'Bienvenido al Chat'
	});

	client.on('disconnect', () => {
		console.log('Usuario desconectado');
	});

	// Escuchar al cliente
	client.on('enviarMensaje', (data, callback) => {
		console.log(data);

		client.broadcast.emit('enviarMensaje', data);
		/*
		if(mensaje.usuario) {
			callback({
				resp: 'Estado OK'
			});
		} else {
			callback({
				resp: 'Estado no OK'
			});
		}
		*/
	});
});
