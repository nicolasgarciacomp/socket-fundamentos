/**
 * @fileoverview	./server/classes/usuarios.js
 *
 * @version         1.0
 *
 * @author          Nicolás Garcia <nicolasgarciacomp@gmail.com>
 *
 * History
 * v1.0 – Se creó el archivo
**/

class Usuarios {

	/**
	 * @name	constructor
	 *
	 * @description	Inicializa el array personas en vacio
	 *
	 * @param	{}
	 *
	 * @return  {}
	**/
	constructor() {
		this.personas = [];
	}

	/**
	 * @name	agregarPersona
	 *
	 * @description	Añade una persona al array personas
	 *
	 * @param	{number, string, string, string}
	 *
	 * @return  {object}
	**/
	agregarPersona(id, nombre, sala, genero) {
		let persona = {id, nombre, sala, genero};
		this.personas.push(persona);

		return this.personas;
	}

	/**
	 * @name	getPersona
	 *
	 * @description	Devuelve una persona por id
	 *
	 * @param	{number}
	 *
	 * @return  {object}
	**/
	getPersona(id) {
		let persona = this.personas.filter(persona => {
			return persona.id === id;
		})[0];

		return persona;
	}

	/**
	 * @name	getPersonas
	 *
	 * @description	Devuelve el objeto personas
	 *
	 * @param	{}
	 *
	 * @return  {object}
	**/
	getPersonas() {
		return this.personas;
	}

	/**
	 * @name	getPersonasPorSala
	 *
	 * @description	Devuelve la cantidad de personas de una determinada sala
	 *
	 * @param	{string}
	 *
	 * @return  {number}
	**/
	getPersonasPorSala(sala) {
		let personasEnSala = this.personas.filter(persona => {
			return persona.sala === sala;
		});

		return personasEnSala;
	}

	/**
	 * @name	borrarPersona
	 *
	 * @description	Elimina una persona del array personas por su id
	 *
	 * @param	{number}
	 *
	 * @return  {object}
	**/
	borrarPersona(id) {
		let personaBorrada = this.getPersona(id);
		this.personas = this.personas.filter(persona => {
			return persona.id != id;
		});

		return personaBorrada;
	}
}

// Exporto la clase
module.exports = {
	Usuarios
}
