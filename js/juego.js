/*
	- 2C = Two of Clubs
	- 2D = Two of Diaminds
	- 2H = Two of Hearts
	- 2S = Two of Spades
*/

const miModulo = (() => {
	'use strict'

	const tiposCarta 					= ['C', 'D', 'H', 'S'],
				especiales 					= ['A', 'J', 'Q', 'K'],
				buttonNuevo 				= document.querySelector('.button-new'),
				buttonPedir 				= document.querySelector('.button-primary'),
				buttonDetener 			= document.querySelector('.button-danger'),
				puntosHtml 					= document.querySelectorAll('small'),
				containerCartas			= document.querySelectorAll('.container-card'),
				modalGanador				= document.querySelector('.modal');

	let deck 							= [],
			puntosJugadores   = [];


	// Esta función inicializa el juego
	const inicializarJuego = ( numeroJugadores = 2 ) => {
		deck = crearDeck();
		puntosJugadores = [];

		for (let i = 0; i < numeroJugadores; i++) {
			puntosJugadores.push(0);
			// puntosHtml[i].textContent = 0;
		}

		puntosHtml.forEach(( element ) => element.textContent = 0);
		containerCartas.forEach(( element ) => element.innerHTML = '');

		buttonDetener.disabled = false;
		buttonPedir.disabled = false;
		
		modalGanador.classList.remove('modal--show');
	}

	// Crea un nuevo deck ( varaja )
	const crearDeck = () => {
		deck = [];
		for( let i = 2; i < 10; i++ ) {
			for( let tipo of tiposCarta ) {
				deck.push( i + tipo );
			}
		}

		for( let tipo of tiposCarta ) {
			for( let especial of especiales ) {
				deck.push( especial + tipo );
			}
		}

		return _.shuffle( deck );
	}

	// Funcion permite pedir carta
	const pedirCarta = ( ) => {
		if ( deck.length === 0 ) {
			throw 'No hay cartas en el deck';
		}
		return deck.pop();
	}


	const valorCarta = ( carta ) => {
	const valor = carta.substring(0, carta.length - 1);
	return ( isNaN( valor ) ) ? 
			( valor === 'A' ) ? 11 : 10
			: valor * 1;
	}

	// Funcion crea el acumulador de puntos
	const acumuladorPuntos = ( carta, turno ) => {
		puntosJugadores[ turno ] = puntosJugadores[ turno ] + valorCarta( carta );
		puntosHtml[ turno ].textContent = puntosJugadores[ turno ];
		return puntosJugadores[ turno ];
	}

	// Funcion crear imagen carta
	const crearCarta = ( carta, turno ) => {
		const imageCarta = document.createElement('img');
		imageCarta.classList.add('card');
		imageCarta.src = `assets/cartas/${ carta }.png`;
		containerCartas[turno].appendChild( imageCarta );
	}

	const ventaModalGanador = ( texto ) => {
		modalGanador.classList.add('modal--show');
		modalGanador.firstElementChild.firstElementChild.textContent = texto;
	}
	
	// Funcion determina el ganador
	const determinarGanador = ( ) => {
		const [ puntosMinimos, puntosComputadora ] = puntosJugadores;
		setTimeout(() => {
			if ( puntosComputadora === puntosMinimos ) { ventaModalGanador('Nadie gana :(');}
			else if ( puntosMinimos > 21 ) { ventaModalGanador('Computadora gana!'); }
			else if ( puntosComputadora > 21 ) { ventaModalGanador('Jugador gana ❤️!'); }
			else { ventaModalGanador('Computadora gana!'); }
		}, 100);
	}


	// Funcion de turno de la computadora
	const turnoComputadora = ( puntosMinimos ) => {
		let puntosComputadora = 0;
		do {
			const carta = pedirCarta();
			puntosComputadora = acumuladorPuntos( carta, puntosJugadores.length - 1);

			crearCarta( carta, puntosJugadores.length - 1 );

			if( puntosMinimos > 21) break;
		} while ( (puntosComputadora < puntosMinimos) && (puntosMinimos <= 21));
		determinarGanador();
	}

	// Eventos
	buttonPedir.addEventListener('click', () => {
		const carta = pedirCarta();
		const puntosJugador = acumuladorPuntos( carta, 0);
		crearCarta( carta, 0 );

		if( puntosJugador > 21 ) {
			buttonPedir.disabled = true;
			buttonDetener.disabled = true;
			turnoComputadora( puntosJugador );
		} else if( puntosJugador === 21 ) {
			buttonDetener.disabled = true;
			turnoComputadora( puntosJugadores[1] );
		}
	});

	buttonDetener.addEventListener('click', () => {
		buttonPedir.disabled = true;
		buttonDetener.disabled = true;
		turnoComputadora( puntosJugadores[0] );
	});

	return { nuevoJuego: inicializarJuego };
})();
