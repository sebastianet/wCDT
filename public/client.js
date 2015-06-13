
// funcio "llegirCookie" - es crida en fer LOGON() i en fer HELP()
function llegirCookie( name ) {
	var nameEQ = name + "=" ;
	var ca = document.cookie.split( ';' ) ;
		for( var i=0 ; i < ca.length; i++ ) {
		var c = ca[i] ;
		while ( c.charAt(0)==' ' ) c = c.substring( 1, c.length ) ;
		if ( c.indexOf(nameEQ) == 0 ) return c.substring( nameEQ.length, c.length ) ;
	} ; 
	return null ;
} ; // llegirCookie()


// nova funció yyyyymmdd de Date() - at client
Date.prototype.yyyymmdd = function () {                            
	var yyyy = this.getFullYear().toString();                                    
	var mm   = (this.getMonth()+1).toString(); // getMonth() is zero-based         
	var dd   = this.getDate().toString();
	return yyyy + '/' + (mm[1]?mm:"0"+mm[0]) + '/' + (dd[1]?dd:"0"+dd[0]);
} ; // yyyymmd

Date.prototype.hhmmss = function () {
	function fixTime(i) {
        return (i < 10) ? "0" + i : i;
    }
	var today = new Date(),
	    hh = fixTime( today.getHours() ),
		mm = fixTime( today.getMinutes() ),
		ss = fixTime( today.getSeconds() ) ;
	var myHHMMSS = hh + ':' + mm + ':' + ss ;
	return myHHMMSS ;
} ; // hhmmss

// Quan es pica el link de "INICI", demanem al servidor una pagina i la posem on indica "#content".
// Es crida desde 2 llocs :
//  a) index_ready()
//  b) initial_ready() - per assignar el codi a un link que hi ha dins INITIAL.HTM
function fClickLogon() { 

	console.log( '+++ establir codi a executar en picar Logon().' ) ;
 	$( ".clkLogon" ).click( function() {

		console.log( '*** you did click on LOGON() link.' ) ;
		$.get( '/logon.htm', function( page ) {

			console.log( '*** index - demanem al server la sub-pagina LOGON.' ) ;
			$( "#content" ).html( page ) ; // show received HTML at specific <div>

			var x = llegirCookie( 'kukHN') ;
			var y = llegirCookie( 'kukVER') ;
			if ( ( x ) && ( y ) ) {
				var szOut = '<center>hn{' + x + '} ' + y + '</center>' ;
				$( "#my_hostname" ).html( szOut ) ;
				console.log( '+++ set HOSTNAME[%s] and VERSION[%s].', x, y ) ;
			} else {
				console.log( '--- couldnt find cookie for HOSTNAME[%s] or VERSION[%s].', x, y ) ;
			} ;

		}) ; // get(logon)
	}) ; // clkLogon

} ; // fClkLogon()

 
// exemple d'us:   
//    ferReserva( $(this).serialize(), "#content" ) ; // reserva.htm
//    ferReserva( "Nom_Soci="+soci+"&Pista_Reserva="+clkPista+"&Dia_Reserva="+avui+"&Hora_Reserva="+clkHora, "#content" ) ; // consulta.htm
      
function ferReserva( myDades, myContent ) {

	$.post( "/fer_una_reserva/" + myDades, function( dades ) {
	
		var lng = 0 ;
		lng = dades.length ;
		console.log( ">>> Fer reserva - server response (%s) : {%s}.", lng, dades ); // show whole JSON object
		
		$( myContent ).html( dades );  // or "text" - set server data onto actual page

	}); // post(fer reserva)

//	return false ; // stop processing !!!
		
} ; // ferReserva()


function esborrarReserva( myDades, myContent ) {

	$.post( "/esborrar_una_reserva/" + myDades, function( dades ) {
	
		var lng = 0 ;
		lng = dades.length ;
		console.log( ">>> Esborrar reserva - server response (%s) : {%s}.", lng, dades ); // show whole JSON object
		
		$( myContent ).html( dades );  // or "text" - set server data onto actual page

	} ) ; // post(esborrar reserva)

} ; // esborrarReserva()



function index_ready() {              // DOM ready for index.htm

	console.log( '*** index DOM ready.' ) ;
	
	window.session = {} ;             // unique global var for all the client application !
	window.session.user = {} ;        // set "no user" at begin

	//	window.session.user.nom = '-' ;   // set "no user name" at begin
// ---	window.session.avui = (new Date).yyyymmdd() ;

	delete window.session.user.nom ;      // same at logoff() time !

// amagar link "admin" - will be visible after logon(admin) and hidden at logoff
	$( '#clkAdmin' ).hide() ;         // http://api.jquery.com/hide/

// Com manegar el nom d'usuari:
//	window.session.user.nom = 'pau' ;
//	$( "#watermark" ).html( '<p>Current user is ... PAU' ) ; // show received HTML at specific <div>

// posem el calendari del mes actual
	$.get( '/mes_actual.htm', function( page ) {
		console.log( '*** index - demanem al server la sub-pagina MES_ACTUAL.' ) ;
		$( "#my_month" ).html( page ) ; // show received HTML at specific <div>
	}) ; // get(actual month html code)


// posar la data actual a baix a l'esquerra - aixi diferenciem re-loads - "Now is"
	var szAra = '<center>[' + (new Date).yyyymmdd() +','+ (new Date).hhmmss() + ']</center>' ;
	$( "#my_date" ).html( szAra ) ; // show actual date


// posar el hostname actual a baix a l'esquerra - aixi diferenciem servidors
	var szHostname = '<center>HN [ &lt;do logon> ]</center>' ;
	$( "#my_hostname" ).html( szHostname ) ; // show actual server


// posem al CONTENT (we are a SPA) la sub-pagina INITAL.HTML
	$.get( '/initial.htm', function( page ) {
		console.log( '*** Demanem al server INITIAL.HTM, initial SPA text.' ) ;
		$( "#content" ).html( page ) ; // show received HTML at specific <div>
	}) ; // get(initial.htm)


// Quan es pica el link de "INICI", demanem al servidor una pagina i la posem on indica "#content".
	$( ".clkInici" ).click( function() {
		$.get( '/initial.htm', function( page ) {
			console.log( '*** index - demanem al server la sub-pagina INITIAL.' ) ;
			$( "#content" ).html( page ) ; // show received HTML at specific <div>
		}) ; // get(initial)
	}) ; // clkInici


	fClickLogon() ; // index_ready()

	
	$( ".clkFerReserva" ).click( function() {
		
		console.log( '*** Fer reserva - nom (%s).', window.session.user.nom ) ;
		if ( window.session.user.nom ) { // "logged in" 

			$.get( '/reserva.htm', function( page ) {
				console.log( '*** index - demanem al server la sub-pagina RESERVA.' ) ;
				$( "#content" ).html( page ) ; // show received HTML at specific <div>
			}) ; // get (reserva)
			
		} else {
			$( "#content" ).html( "--- do Logon() before creating reserva - no window.session.user.nom" ) ;
		} ; //
	}) ; // fer reserva

	
	$( ".clkConsultaReserva" ).click( function() {
		$.get( '/consulta.htm', function( page ) {
			console.log( '*** index - demanem al server la sub-pagina CONSULTA.' ) ;
			$( "#content" ).html( page ) ; // show received HTML at specific <div>
		}) ; // get(consulta)
	}) ; // consulta reserva


	$( ".clkEsborrarReserva" ).click( function() {

		console.log( '*** Fer reserva - nom (%s).', window.session.user.nom ) ;
		if ( window.session.user.nom ) { // "logged in" 

			$.get( '/esborra.htm', function( page ) {
				console.log( '*** index - demanem al server la sub-pagina ESBORRAR.' ) ;
				$( "#content" ).html( page ) ; // show received HTML at specific <div>
			}) ; // get(esborrar)
			
		} else {
			$( "#content" ).html( "--- do Logon() before deleting reserva - no window.session.user.nom" ) ;
		} ;
	}) ; // esborrar reserva


	$( "#clkHelp" ).click( function() {
		$.get( '/help.htm', function( page ) {
			console.log( '*** index - demanem al server la sub-pagina HELP.' ) ;
			$( "#content" ).html( page ) ; // show received HTML at specific <div>
		}) ; // get(help)
	}) ; // help


	$( "#clkAdmin" ).click( function() {
		
//		$.get( '/admin', function( page ) {
//			console.log( '**** HELP.HTM - Demanem al server de fer ADMIN.' ) ;
//			$( "#content" ).html( page ) ; // show received HTML at specific <div>
//		}) ; // get(admin)

		event.preventDefault() ; // what is it for ? If this method is called, the default action of the event will not be triggered. http://api.jquery.com/event.preventdefault/
 		$.ajax( {
			url: '/admin',
			success : function( page ) { 

				$.get( '/admin.htm', function( page ) {
					console.log( '**** HELP.HTM - Demanem al server la pagina ADMIN.HTM.' ) ;
					$( "#content" ).html( page ) ; // show received HTML at specific <div>
				}) ; // get(admin.htm)
			
			},
			statusCode: {
				401: function() { $( "#content" ).html( '<p>rc 401 - Admin() not authorized</p>' ) },
			} 
		} ) ; // get(admin)
		
		return false ; // stop processing !!!

	}) ; // admin
	
	
	$( "#clkLinks" ).click( function() {
		$.get( '/links.htm', function( page ) {
			console.log( '**** HELP.HTM - Demanem al server la sub-pagina LINKS.' ) ;
			$( "#content" ).html( page ) ; // show received HTML at specific <div>
		}) ; // get(links)
	}) ; // links

	
} ; // index_ready(), DOM ready for INDEX.HTM



function consulta_ready() {

	console.log( '*** consulta DOM ready.' ) ;
	
	$( "#myFormReqDades1Dia input[name='data_Reserva']" ).datepicker( { dateFormat: "yy/mm/dd" } ) ;
//
// dons set this field everytime the page is loaded
// instead, set an initial value if we dont have a cookie that indicates a previous "consulta", and the keep on with the date selected by user via "datepicker"
// compte : the user has not to be able to edit this field manually
//	$( "#myFormReqDades1Dia input[name='data_Reserva']" ).val( (new Date).yyyymmdd() ) ;

	var x = llegirCookie( 'kukDDC') ; // Data Darrera Consulta, as 2015/06/13
	if ( x == "undefined" ) {
		$( "#myFormReqDades1Dia input[name='data_Reserva']" ).val( (new Date).yyyymmdd() ) ;
	} else { // hi ha hagut consulta anterior
		var y = decodeURIComponent ( x ) ;  // change "/" into "%2F"
		$( "#myFormReqDades1Dia input[name='data_Reserva']" ).val( y ) ;
		console.log( '**** CONSULTA.HTM - set date to (%s).', y ) ;		
	} ;

	$( "#myFormReqDades1Dia" ).submit( function( event ) {
	// will produce a msg as "GET /qui_te_reserves/data_Reserva=2014/12/06" to be sent to the server

		console.log( '[+] boto CONSULTA polsat - get ocupacio de un dia.' ) ;
		
// 1 - get table HTML

		var myDate = $( this ).serialize() ;              // save user entry of this form : [data_Reserva=2014%2F11%2F10]
		var szJustDate = myDate.substring(13) ;           // just after the "="
		szJustDate = decodeURIComponent ( szJustDate ) ;  // change %2F into "/"

		$.get( '/tbl1day.htm', function( page ) {         // get empty table

			console.log( '**** Demanem al server la taula on posar la ocupacio del dia ['+ szJustDate +'].' ) ;
			$( "#content" ).html( page ) ; // show received HTML at specific <div>

// 2 - get "dades" for the table

			console.log( '*** consulta - demanem al server la llista de reserves per un dia. Data (%s)', myDate ) ; // output is "data_Reserva=2014/12/06"

// debugger;
			$.get( '/qui_te_reserves/' + myDate, function( dades ) {

				console.log( ">>> consulta - server response : {%s}.", dades ); // show whole JSON object
				
				var lng = 0 ;
				lng = dades.length ;
				console.log( '+++ consulta - llargada (%s).', lng ) ;
				if ( lng > 0 ) {
				  var i = 0 ;
				  while ( i < lng ) {
                    var szNom   = dades[i].rnom ;
					var szPista = dades[i].rpista ;
					var szData  = dades[i].rdata ;
					var szHora  = dades[i].rhora ;
					var sz1User = "En {" + szNom + "} te la pista [" + szPista + "] el dia {" + szData + "} a les {" + szHora + "}" ;
					console.log( ">>> consulta - ocupant [%i] : (%s).", i, sz1User ); // 
					
					var szCella = "#tdh"+szHora+"p"+szPista ;  // calculem a quina cella va el texte - veure els noms a sebas.css !
					console.log( ">>> consulta - ocupem la Cella (%s).", szCella ); // debug

					$( szCella ).html( szNom ) ;                      // posar el texte visible a la cella
					$( szCella ).addClass( "ocupada" ) ;              // canviem la class de la cella : afegim "ocupada" ...
					$( szCella ).removeClass( "lliure" ) ;            // ... i treiem "lliure"
					$( szCella ).attr( 'cdt_usuari_pista', szNom ) ;  // set user name in own field of cell
					
					i++ ;  // per totes les reserves
				  } ; // while  
				} ; // lng > 0

// +++ codi per associar el event "click" a una cella de la taula

	$( 'td.lliure' ).on( 'click', function( ev ) {
		//dia i hora i soci i pista construir serial...
	
		var targetID = $(this).attr( 'id' ) ;
		console.log( 'consulta - onclick td.lliure - el seu ID es {'+ targetID +'}' ) ;
		  
		var clkPrefix = targetID.substring(0,3) ; // tdh10p3
		var clkPista  = targetID.substring(6,7) ; // tdh10p3
		var clkHora   = targetID.substring(3,5) ; // tdh10p3

		if ( clkPrefix == 'tdh' ) {

			var avui = $ ('#ocupacio_1_dia>thead>tr>th:nth-child(1)').text() ; // "2014%2F11%2F10"
			var soci = window.session.user.nom ;
			avui = encodeURIComponent(avui) ; // convert "/" into "%2F"

			console.log( 'consulta - fer reserva - pfx('+ clkPrefix +') - pista '+ clkPista +', hora '+ clkHora +', soci '+ soci +', data '+ avui ) ;
			ferReserva( "Nom_Soci="+ soci +"&Pista_Reserva="+ clkPista +"&Dia_Reserva="+ avui +"&Hora_Reserva="+ clkHora, "#content" ) ; // client.js

		} else { // wrong prefix
		} ;
		return false ; // stop processing
 
    }); // OnClick - codi a executar quan piquem TD.LLIURE


	$( 'td.ocupada' ).on( 'click', function( ev ){

		var targetID = $(this).attr( 'id' ) ;
		console.log( 'consulta - onclick td.ocupada - el seu ID es {'+ targetID +'}' ) ;

		var targetUser = $(this).text() ;
		console.log( 'consulta - onclick td.ocupada - el seu USER es {'+ targetUser +'}' ) ;

		var clkPrefix = targetID.substring(0,3) ; // tdh10p3
		var clkPista  = targetID.substring(6,7) ; // tdh10p3
		var clkHora   = targetID.substring(3,5) ; // tdh10p3

		if ( clkPrefix == 'tdh' ) {

			var avui = $ ('#ocupacio_1_dia>thead>tr>th:nth-child(1)').text() ; // "2014%2F11%2F10"
			var soci = window.session.user.nom ;
			avui = encodeURIComponent(avui) ; // convert "/" into "%2F"

			console.log( 'consulta - esborrar reserva - pfx('+ clkPrefix +') - pista '+ clkPista +', hora '+ clkHora +', soci '+ soci +', data '+ avui ) ;

			// create a msg as "GET /esborrar_una_reserva/Nom_Soci_Esborrar=Ivan&Pista_Reserva_Esborrar=3&Dia_Reserva_Esborrar=2015%2F02%2F19&Hora_Reserva_Esborrar=10"
			var szEsborrarReserva = "Nom_Soci_Esborrar=" + soci ;
			szEsborrarReserva += "&Pista_Reserva_Esborrar=" + clkPista ;
			szEsborrarReserva += "&Dia_Reserva_Esborrar=" + avui ;
			szEsborrarReserva += "&Hora_Reserva_Esborrar=" + clkHora ;

			// call code
			esborrarReserva( szEsborrarReserva, "#content" ) ; // client.js - common code with "erase reservation from "consulta"

		} else { // wrong prefix
		} ;
		
		return false ;
 
    }); // OnClick - codi a executar quan piquem TD.OCUPADA

// ---

// posar la data de la reserva al primer quadre dalt a l'esquerra

				$( '#ocupacio_1_dia>thead>tr>th:nth-child(1)' )
				    .css( {'color': 'black', 'vertical-align': 'middle'} )
					.text( szJustDate ) ;

			}); // get(dades)
		
		}) ; // get(table HTML)

		return false ; // stop processing !!!
		
	}); // click "myFormReqDades1Dia" submit

} ; // consulta_ready()



function reserva_ready() {
	
	console.log( '*** reserva DOM ready.' ) ;
	
// construim jQuery widgets
   $( "#myFormFerReserva input[name='Dia_Reserva']" ).datepicker( {dateFormat: "yy/mm/dd"} );
   $( "#myFormFerReserva input[name='Hora_Reserva']" ).spinner({	   
	  min: 9,
      max: 22,
	  step: 1,
	  start: 9,
	  numberFormat: "n"	   
   });
   
// assignem valors inicials 
	$( "#myFormFerReserva input[name='Dia_Reserva']" ).val( (new Date).yyyymmdd() );
	$( "#myFormFerReserva input[name='Nom_Soci']" ).val( window.session.user.nom );

// injectem comportament de submit
	$( "#myFormFerReserva" ).submit( function( event ) {
	// will produce a msg as "GET /fer_una_reserva/Nom_Soci=nil&Pista_Reserva=0&Dia_Reserva=2000%2F01%2F01&Hora_Reserva=00"

		console.log( '[+] boto RESERVA polsat - fer una reserva.' ) ;
		
		ferReserva( $(this).serialize(), "#content" ) ; // client.js - common code with "do reservation from "consulta"
		
/*                  
					var myDades = $( this ).serialize() ;  // save user entry
					
					$.post( "/fer_una_reserva/" + myDades, function( dades ) {
						var lng = 0 ;
						lng = dades.length ;
						console.log( ">>> Server response (%s) : {%s}.", lng, dades ); // show whole JSON object
						
						$('#content').html( dades );  // or "text"

					}); // get(dades) 
*/
					
		return false ; // stop processing !!!
		
	}); // click "myFormFerReserva" submit

} ; // reserva_ready()



function esborra_ready() {

	console.log( '*** reserva DOM ready.' ) ;
	
	$( "#myFormEsborrarReserva input[name='Dia_Reserva_Esborrar']").datepicker( {dateFormat: "yy/mm/dd"} );
	$( "#myFormEsborrarReserva input[name='Dia_Reserva_Esborrar']").val( (new Date).yyyymmdd() );
	$( "#myFormEsborrarReserva input[name='Nom_Soci_Esborrar']" ).val( window.session.user.nom );
	
	$( "#myFormEsborrarReserva" ).submit( function( event ) {
	// will produce a msg as "GET /esborrar_una_reserva/Nom_Soci=nil&Pista_Reserva=0&Dia_Reserva=2000%2F01%2F01&Hora_Reserva=00"

		console.log( '[+] boto ESBORRAR polsat - anular una reserva.' ) ;
		esborrarReserva( $(this).serialize(), "#content" ) ; // client.js - common code with "erase reservation from "consulta"

		return false ; // stop processing !!!

	}); // click "myFormEsborrarReserva" submit
		
} ; // esborra_ready()



function logon_ready() {

	console.log( '*** logon DOM ready.' ) ;
	
 	$( "#myFormReqLogon" ).submit( function( event ) {
		
		var myLogon = $( this ).serialize() ;  // get user entry and display it
		
		console.log( '[+] boto LOGON polsat - logon ('+ myLogon +').' ) ; // logon(nom_Logon=Ivan&pwd_Logon=Grozniy).
		var i = myLogon.indexOf("&") ;
//		console.log( '[+] boto polsat - AMP at ('+i+').' ) ;
		var logonUser = myLogon.substring( 10, i ) ;
		console.log( '[+] boto LOGON polsat - USR is ('+ logonUser +').' ) ;
		var j = myLogon.length ;
//		console.log( '[+] boto polsat - PAR at ('+j+').' ) ;
		var logonPwd = myLogon.substring( i+11, j ) ;
		console.log( '[+] boto LOGON polsat - PWD is ('+ logonPwd +').' ) ;

//		$.get( '/logonuser/' + myLogon, function( page ) {
//			console.log( '**** Demanem al server de fer LOGON() de un usuari.' ) ;
//			$( "#content" ).html( page ) ; // show received HTML at specific <div>
//		}) ; // get(logon)

		event.preventDefault() ; // what is it for ? If this method is called, the default action of the event will not be triggered. http://api.jquery.com/event.preventdefault/
 		$.ajax( {
			url: '/logonuser/' + myLogon,
			
			success : function( page ) { 

				$( "#content" ).html( page ) ;
				
				var lng = page.length ;
				var idx = page.indexOf( "Tens poders" ) ; // no cookie yet (PAL)
//				console.log( '+++ logon() success, rcvd PAGE of size ('+ lng + '), index POWERS : {' + idx + '}.' ) ;

// here we have to make ADMIN LINK visible if user is an ADMIN one !
				
				if ( idx > 0 ) { // if ( logonUser == 'pere' ) {
					$( '#clkAdmin' ).show() ;
				} else {
					$( '#clkAdmin' ).hide() ;
				} ;
				
				window.session.user.nom = logonUser ;
//				document.title = "Web CDT, user (" + logonUser + ")" ;
//				$( "#watermark" ).html( '<p>Ara soc en {' + logonUser + '}.' ) ;
				
				$.get( "/get_usr_and_host", function( dades_user_i_host ) {
//					document.title = "Web CDT (" + dades_user_i_host + ")" ;
					$( "#watermark" ).html( '<p>Ara soc en {' + dades_user_i_host + '}.' ) ;
				} ) ; // get_usr_and_host()
			},
			statusCode: {
				401: function() { $( "#content" ).html( '<p>'+ (new Date).yyyymmdd() +' Logon() user('+ logonUser +') not authorized</p>' ) },
				404: function() { $( "#content" ).html( '<p>Logon() unavailable   </p>' ) },
				500: function() { $( "#content" ).html( '<p>Logon() server error  </p>' ) }
			} 
		} ) ; // get(admin)
		
		return false ; // stop processing !!!
	
	}); // click "myFormReqLogon" submit
	
	
 	$( "#myFormReqLogoff" ).submit( function( event ) {

		$.post( "/logoff_user", function( dades ) {
		
			console.log( ">>> Request logoff - server response (%s).", dades ); // show whole JSON object
			
			$( "#content" ).html( dades );  // or "text" - set server data onto actual page
//			$( "#content" ).html( '<p>+++ Logged off successfully.</p>' ) ;
			
			delete window.session.user.nom ;
//			document.title = "Web CDT, no user" ;
			$( '#clkAdmin' ).hide() ;
			
			$( "#watermark" ).html( '<p>Logged off.' ) ;

		}); // post( logoff )

		return false ; // stop processing !!!
		
	}); // click "myFormReqLogoff" submit

	
} ; // logon_ready()



function help_ready() {

	console.log( '*** help DOM ready.' ) ;

// server sets 'kukTIT'
// HELP.HTM has <div id="listcki">
	var x = llegirCookie( 'kukVER') ; // get server version string
	if ( x ) {
		var szOut = '# server version is >' + x + '<' ;
		$( "#listcki" ).html( szOut ) ; // show received HTML at specific <div>

		$.get( "/get_usr_and_host", function( dades_user_i_host ) {
//			document.title = "Web CDT (" + dades_user_i_host + ")" ;
			$( "#listuih" ).html( 'U/H {' + dades_user_i_host + '}.' ) ;
		} ) ; // get_usr_and_host()

	} ;

	
	$( "#clkPing" ).click( function() {
		$.get( '/ping', function( page ) {
			console.log( '**** HELP.HTM - Demanem al server un PING.' ) ;
			$( "#content" ).html( page ) ; // show received HTML at specific <div>
		}) ; // get(ping)
	}) ; // ping

	
} ; // help_ready()



function initial_ready() {
	
	console.log( '*** initial DOM ready.' ) ;

// Quan es pica el link de "LOGON", demanem al servidor una pagina i la posem on indica "#content".
// compte : es troba 2 cops - (a) index_ready() + (b) initial_ready()

/* 	$( ".clkLogonInitial" ).click( function() {
		console.log( '*** you did click on LOGON() link in INITIAL.HTM.' ) ;
		$.get( '/logon.htm', function( page ) {
			console.log( '*** index - demanem al server la sub-pagina LOGON.' ) ;
			$( "#content" ).html( page ) ; // show received HTML at specific <div>
		}) ; // get(logon)
	}) ; // clkLogon
*/
	 fClickLogon() ; // initial_ready()
	 
} ; // initial_ready()



function admin_ready() {
	
	console.log( '*** admin DOM ready.' ) ;

	$( "#clkAdminListUsers" ).click( function () {
		
		console.log( "*** ADMIN.HTM - lets list all users." ) ;

		$.get( '/dump_all_users', function ( page ) {

			console.log( "*** ADMIN.HTM - Demanem la llista de tots els usuaris. Server response {%s}.", page ) ;
			var lng = 0 ;
			lng = page.length ;
			console.log( '+++ Llargada (%s).', lng ) ;
			
			var texte = '<p class="pkon">Dump all data in <i>users</i> DDBB. ' ;
			if ( lng > 0 ) {
				texte += "Hi ha (" + lng + ") usuaris. <br>" ;
				var i = 0;
				while ( i < lng ) {
					texte += "("+ i +") " ;
					texte += "user (" + page[i].uAlias + ") " ;
					texte += "pwd (" + page[i].uPwd + ") " ;
					texte += "role (" + page[i].uRole + ") " ;
//					texte += "ID [" + page[i]._id + "] " ;
					texte += "<br>" ;
					i++ ;
				} // while
			} else { 
				texte += "No users defined yet." ;
			} ; // lng = 0
			texte += "</p>" ;
			$( '#content' ).html( texte ) ;  // or "text"
		} ) ; // get(dump_all_users@admin)

	} ) ; // click List Users from Admin menu


	$( "#clkAdminEsborrarTaulaUsers" ).click( function () {

		console.log( "*** ADMIN.HTM - delete taula users." ) ;

		$.get( '/delete_col_users', function( page ) {
			console.log( '**** ADMIN.HTM - Demanem al server drop() COL users.' ) ;
			$( "#content" ).html( page ) ; // show received HTML at specific <div>
		}) ; // get(delete taula users)

	} ) ; // click Esborrar taula Users from Admin menu


// create database containing known users - done at powerOn time, if it does not exist
//	$( "#clkAdminCreateUsersCollection" ).click( function() {
//		$.get( '/create_users_col', function( page ) {
//			$( "#content" ).html( page ) ; // show received HTML at specific <div>
//		} ) ; // get(ceate users collection)
//	}) ; // clkCreateUsersCollection


// injectem comportament(s) de submit
	$( "#myFormReqAltaUser" ).submit( function( event ) {
	// will produce a msg as "GET /fer_alta_usuari/AltaUserNom=joan&AltaUserPwd=pere&AltaUserEmail=a@b.c&AltaUserType=Guest"

		console.log( '[+] boto ALTA USER polsat - crear usuari.' ) ;
		
		var myDades = $( this ).serialize() ;  // save user entry
		
		$.get( "/fer_alta_usuari/" + myDades, function( dades ) {
			
			var lng = 0 ;
			lng = dades.length ;
			console.log( ">>> Alta User - server response (%s) : {%s}.", lng, dades ); // show whole JSON object
			
			$( '#content' ).html( dades );  // or "text"

		}); // get(/alta) 
					
		return false ; // stop processing !!!
		
	}); // click "myFormReqAltaUser" submit


	$( "#myFormReqBaixaUser" ).submit( function( event ) {
	// will produce a msg as "GET /fer_baixa_usuari/BaixaUserNom=joan"

		console.log( '[+] boto BAIXA USER polsat - esborrar usuari.' ) ;
		
		var myDades = $( this ).serialize() ;  // save user entry
		
		$.get( "/fer_baixa_usuari/" + myDades, function( dades ) {
			var lng = 0 ;
			lng = dades.length ;
			console.log( ">>> Baixa user - server response (%s) : {%s}.", lng, dades ); // show whole JSON object
			
			$( '#content' ).html( dades );  // or "text"

		}); // get(/baixa) 
					
		return false ; // stop processing !!!
		
	}); // click "myFormReqBaixaUser" submit


	$( "#clkListCollections" ).click( function() {
		
		console.log( '*** index - clicked on LIST COLLECTION link - demanem al server la llista de collections.' ) ;

		$.get( '/list_collections', function( page ) {
			console.log( '*** index - rebem del server la llista de collections.' ) ;
			var szTxt = '<p>Databases we have right now in mongo:</p>' ;
			$( "#content" ).html( szTxt+page ) ; // show calculated HTML at specific <div>
		} ) ; // get(list collections)
	}) ; // list collections


	$( "#clkPopulate" ).click( function() {
		$.get( '/populate', function( page ) {
			console.log( '**** HELP.HTM - Demanem al server omplir la BBDD.' ) ;
			$( "#content" ).html( page ) ; // show received HTML at specific <div>
		}) ; // get(populate)
	}) ; // populate


    $( "#clkConsultaAllReserves" ).click( function () {

		$.get( '/dump_all_reserves', function ( page ) {
			
            console.log( "*** HELP.HTM - Demanem la llista de totes les reserves. Server response {%s}.", page ) ;
            var lng = 0 ;
            lng = page.length ;
            console.log( '+++ Llargada (%s).', lng ) ;
			
            var texte = '<p class="pkon">';
            if ( lng > 0 ) {
                texte += "Dump all data in <i>reserves</i> DDBB. Hi ha (" + lng + ") reserves. <br>";
                var i = 0;
                while ( i < lng ) {
                    texte += "("+i+") " ;
					texte += "en (" + page[i].rnom + ") " ;
					texte += "te reservada la pista ("+page[i].rpista+") el dia ["+page[i].rdata+"] a les ["+page[i].rhora+"] hores" ;
//					texte += " - ID [" + page[i]._id + "]" ;
					texte += " <br>" ;
                    i++ ;
                } // while
            } else {  // lng = 0
				texte += "Dump all data in <i>reserves</i> DDBB. No hi ha reserves. <br>";
			} ;
			texte += "</p>"
            $('#content').html(texte);  // or "text"
        }); // get(dump all reserves)
    }); // consulta all reserves

	
} ; // admin_ready()



$( function() {
	
    index_ready(); // DOM ready event
  
} ) ; // DOM ready
