
// exemple d'us:   
//    ferReserva( $(this).serialize(), "#content" ) ; // reserva.htm
//    ferReserva( "Nom_Soci="+soci+"&Pista_Reserva="+clkPista+"&Dia_Reserva="+avui+"&Hora_Reserva="+clkHora, "#content" ) ; // consulta.htm

function ferReserva( myDades, content ) {
	$.post( "/fer_una_reserva/" + myDades, function( dades ) {
	
		var lng = 0 ;
		lng = dades.length ;
		console.log( ">>> Fer reserva - server response (%s) : ", lng, dades ); // show whole JSON object
		
		$(content).html( dades );  // or "text" - set server data onto actual page

	}); // post(reservar)

//	return false ; // stop processing !!!
		
};

