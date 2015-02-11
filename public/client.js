
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



// "Page Ready" event

$( function() {

	window.session = {} ;             // unique global var for all the application !
	
	window.session.user = {} ;        // set "no user" at begin
	
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1;      // January is 0!
	var yyyy = today.getFullYear();

	if( dd<10 ) {
		dd='0'+dd
	} 
	if( mm<10 ) {
		mm='0'+mm
	} 
	window.session.avui = yyyy + '/' + mm + '/' + dd ;

//	window.session.user.nom = 'pau' ;
//	$( "#watermark" ).html( '<p>Current user is ... PAU' ) ; // show received HTML at specific <div>

	$.get( '/mes_actual.htm', function( page ) {
		console.log( '*** index - demanem al server la sub-pagina MES_ACTUAL.' ) ;
		$( "#my_month" ).html( page ) ; // show received HTML at specific <div>
	}) ; // get(actual month html code)


// 20141020, Lluis.
// Quan es pica el link de "LOGON", demanem al servidor una pagina i la posem on indica "#content".

	$( ".clkLogon" ).click( function() {
		$.get( '/logon.htm', function( page ) {
			console.log( '*** index - demanem al server la sub-pagina LOGON.' ) ;
			$( "#content" ).html( page ) ; // show received HTML at specific <div>
		}) ; // get(logon)
	}) ; // logon

	
	$( ".clkConsulta" ).click( function() {
		$.get( '/consulta.htm', function( page ) {
			console.log( '*** index - demanem al server la sub-pagina CONSULTA.' ) ;
			$( "#content" ).html( page ) ; // show received HTML at specific <div>
		}) ; // get(consulta)
	}) ; // consulta

	
	$( ".clkReserva" ).click( function() {
		$.get( '/reserva.htm', function( page ) {
			console.log( '*** index - demanem al server la sub-pagina RESERVA.' ) ;
			$( "#content" ).html( page ) ; // show received HTML at specific <div>
		}) ; // get (reserva)
	}) ; // reserva

	
	$( "#clkHelp" ).click( function() {
		$.get( '/help.htm', function( page ) {
			console.log( '*** index - demanem al server la sub-pagina HELP.' ) ;
			$( "#content" ).html( page ) ; // show received HTML at specific <div>
		}) ; // get(help)
	}) ; // help
	
// more code goes here


	$( "#myFormFerReserva" ).submit( function(event) {
	// will produce a msg as "GET /fer_una_reserva/Nom_Soci=nil&Pista_Reserva=0&Dia_Reserva=2000%2F01%2F01&Hora_Reserva=00"

		console.log( '[+] boto RESERVA polsat - fer una reserva.' ) ;
		
		ferReserva( $(this).serialize(), "#content" ) ; // client.js
		
/*                  
					var myDades = $( this ).serialize() ;  // save user entry
					
					$.post( "/fer_una_reserva/" + myDades, function( dades ) {
						var lng = 0 ;
						lng = dades.length ;
						console.log( ">>> Server response (%s) : ", lng, dades ); // show whole JSON object
						
						$('#content').html( dades );  // or "text"

					}); // get(dades) 
*/
					
		return false ; // stop processing !!!
		

	}); // click "myFormFerReserva" submit

 
 	$( "#myFormReqLogon" ).submit( function(event) {
		
		var myLogon = $( this ).serialize() ;  // get user entry and display it
		
		console.log( '[+] boto LOGON polsat - logon ('+myLogon+').' ) ; // logon(nom_Logon=Ivan&pwd_Logon=Grozniy).
		var i = myLogon.indexOf("&") ;
//		console.log( '[+] boto polsat - AMP at ('+i+').' ) ;
		var logonUser = myLogon.substring( 10, i ) ;
		console.log( '[+] boto LOGON polsat - USR is ('+logonUser+').' ) ;
		var j = myLogon.length ;
//		console.log( '[+] boto polsat - PAR at ('+j+').' ) ;
		var logonPwd = myLogon.substring( i+11, j ) ;
		console.log( '[+] boto LOGON polsat - PWD is ('+logonPwd+').' ) ;

		window.session.user.nom = logonUser ;
		$( "#watermark" ).html( '<p>Ara soc en {'+logonUser+ '} | Logoff' ) ; // show received HTML at specific <div>
		
		return false ; // stop processing !!!
	
	}); // click "myFormReqLogon" submit


} ) ; // DOM ready





	
