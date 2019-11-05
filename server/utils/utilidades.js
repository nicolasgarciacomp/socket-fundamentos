/**
 * @fileoverview	./server/utils/utilidades.js
 *
 * @version         1.0
 *
 * @author          Nicolás Garcia <nicolasgarciacomp@gmail.com>
 *
 * History
 * v1.0 – Se creó el archivo y se exportó la función crearMensaje
**/

/**
 * @name	crearMensaje
 *
 * @description	Devuelve un objeto mensaje con su respectivo nombre(emisor) y la fecha
 *
 * @param	{string, string}
 *
 * @return  {object}
**/
crearMensaje = (nombre, mensaje) => {

	return {
		nombre,
		mensaje,
		fecha: new Date().getTime()
	};
}

// Exporto la función
module.exports = {
	crearMensaje
}
