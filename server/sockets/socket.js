/**
 * @fileoverview	./server/sockets/socket.js
 *
 * @version         1.0
 *
 * @author          Nicolás Garcia <nicolasgarciacomp@gmail.com>
 *
 * History
 * v1.0 – Se creó el archivo
**/

// Requires
const { io } = require('../server.js');
const { Usuarios } = require('../classes/usuarios.js');
const { crearMensaje } = require('../utils/utilidades.js');

const usuarios = new Usuarios(); // Instancia de clase Usuarios

// Todo lo referido a un cliente conectado
io.on('connection', (client) => {
	// Metodo de ingreso al chat
	client.on('entrarChat', (data, callback) => {
		if(!data.nombre || !data.sala) {
			return callback({
				error: true,
				mensaje: 'El nombre/sala es necesario'
			});
		}
		
		client.join(data.sala);

		usuarios.agregarPersona(client.id, data.nombre, data.sala, data.genero);
		client.broadcast.to(data.sala).emit('listaPersona', usuarios.getPersonasPorSala(data.sala));
		client.broadcast.to(data.sala).emit('crearMensaje', crearMensaje('Administrador', `${data.nombre} se unió al chat`));
		callback(usuarios.getPersonasPorSala(data.sala));
	});

	// Metodo crear mensaje publico
	client.on('crearMensaje', (data, callback) => {
		let persona = usuarios.getPersona(client.id);
		let mensaje = crearMensaje(persona.nombre, data.mensaje);
		client.broadcast.to(persona.sala).emit('crearMensaje', mensaje);

		callback(mensaje);
	});

	// Metodo para la desconexion del cliente
	client.on('disconnect', () => {
		let personaBorrada = usuarios.borrarPersona(client.id);
		client.broadcast.to(personaBorrada.sala).emit('crearMensaje', crearMensaje('Administrador', `${personaBorrada.nombre} ha abandonado el chat`));
		client.broadcast.to(personaBorrada.sala).emit('listaPersona', usuarios.getPersonasPorSala(personaBorrada.sala));
	});

	// Mensajes privados
	client.on('mensajePrivado', data => {
		let persona = usuarios.getPersona(client.id);
		client.broadcast.to(data.para).emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje));
	});
});
