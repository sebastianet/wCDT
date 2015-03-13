
// nova funció yyyyymmdd de Date() - at client
Date.prototype.yyyymmdd = function() {                            
	var yyyy = this.getFullYear().toString();                                    
	var mm   = (this.getMonth()+1).toString(); // getMonth() is zero-based         
	var dd   = this.getDate().toString();
	return yyyy + '/' + (mm[1]?mm:"0"+mm[0]) + '/' + (dd[1]?dd:"0"+dd[0]);
};  

   
// exemple d'us:   
//    ferReserva( $(this).serialize(), "#content" ) ; // reserva.htm
//    ferReserva( "Nom_Soci="+soci+"&Pista_Reserva="+clkPista+"&Dia_Reserva="+avui+"&Hora_Reserva="+clkHora, "#content" ) ; // consulta.htm
      
function ferReserva( myDades, myContent ) {

	$.post( "/fer_una_reserva/" + myDades, function( dades ) {
	
		var lng = 0 ;
		lng = dades.length ;
		console.log( ">>> Fer reserva - server response (%s) : ", lng, dades ); // show whole JSON object
		
		$( myContent ).html( dades );  // or "text" - set server data onto actual page

	}); // post(fer reserva)

//	return false ; // stop processing !!!
		
}; // ferReserva()


function esborrarReserva( myDades, myContent ) {

	$.post( "/esborrar_una_reserva/" + myDades, function( dades ) {
	
		var lng = 0 ;
		lng = dades.length ;
		console.log( ">>> Esborrar reserva - server response (%s) : ", lng, dades ); // show whole JSON object
		
		$( myContent ).html( dades );  // or "text" - set server data onto actual page

	}); // post(esborrar reserva)

}; // esborrarReserva()


function index_Ready() {              // DOM ready for index.htm

	console.log( '*** index DOM ready.' ) ;
	
	window.session = {} ;             // unique global var for all the client application !
	window.session.user = {} ;        // set "no user" at begin
//	window.session.user.nom = '-' ;   // set "no user name" at begin
// ---	window.session.avui = (new Date).yyyymmdd() ;
	delete window.session.user.nom ;  // same at logoff() time !

// Com manegar el nom d'usuari:
//	window.session.user.nom = 'pau' ;
//	$( "#watermark" ).html( '<p>Current user is ... PAU' ) ; // show received HTML at specific <div>

// posem el calendari del mes actual

	$.get( '/mes_actual.htm', function( page ) {
		console.log( '*** index - demanem al server la sub-pagina MES_ACTUAL.' ) ;
		$( "#my_month" ).html( page ) ; // show received HTML at specific <div>
	}) ; // get(actual month html code)

// posem al CONTENT (we are a SPA) the INITAL.HTML
	$.get( '/initial.htm', function( page ) {
		console.log( '*** Demanem al server INITIAL.HTM, initial SPA text.' ) ;
		$( "#content" ).html( page ) ; // show received HTML at specific <div>
	}) ; // get(initial.htm)

// Quan es pica el link de "INICI", demanem al servidor una pagina i la posem on indica "#content".
	$( ".clkInici" ).click( function() {
		$.get( '/initial.htm', function( page ) {
			console.log( '*** index - demanem al server la sub-pagina INITIAL.' ) ;
			$( "#content" ).html( page ) ; // show received HTML at specific <div>
		}) ; // get(logon)
	}) ; // logon


// Quan es pica el link de "LOGON", demanem al servidor una pagina i la posem on indica "#content".
	$( ".clkLogon" ).click( function() {
		$.get( '/logon.htm', function( page ) {
			console.log( '*** index - demanem al server la sub-pagina LOGON.' ) ;
			$( "#content" ).html( page ) ; // show received HTML at specific <div>
		}) ; // get(logon)
	}) ; // logon

	
	$( ".clkFerReserva" ).click( function() {
		
		console.log( '*** Fer reserva - nom (%s).', window.session.user.nom ) ;
		if ( window.session.user.nom ) { // "logged in" 

			$.get( '/reserva.htm', function( page ) {
				console.log( '*** index - demanem al server la sub-pagina RESERVA.' ) ;
				$( "#content" ).html( page ) ; // show received HTML at specific <div>
			}) ; // get (reserva)
			
		} else {
			$( "#content" ).html( "--- do Logon() before reserving." ) ;
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
			$( "#content" ).html( "--- do Logon() before deleting a reserva." ) ;
		} ;
	}) ; // esborrar reserva



	$( "#clkHelp" ).click( function() {
		$.get( '/help.htm', function( page ) {
			console.log( '*** index - demanem al server la sub-pagina HELP.' ) ;
			$( "#content" ).html( page ) ; // show received HTML at specific <div>
		}) ; // get(help)
	}) ; // help
	
} ; // DOM ready for INDEX.HTM


function consulta_ready() {

	console.log( '*** consulta DOM ready.' ) ;
	
	$( "#myFormReqDades1Dia input[name='data_Reserva']" ).datepicker( {dateFormat: "yy/mm/dd"});
	$( "#myFormReqDades1Dia input[name='data_Reserva']" ).val( (new Date).yyyymmdd() );

	$( "#myFormReqDades1Dia" ).submit( function(event) {
	// will produce a msg as "GET /qui_te_reserves/data_Reserva=2014/12/06" to be sent to the server

		console.log( '[+] boto CONSULTA polsat - get ocupacio de un dia.' ) ;
		
// 1 - get table HTML

		var myDate = $( this ).serialize() ;  // save user entry of this form : [data_Reserva=2014%2F11%2F10]
		var szJustDate = myDate.substring(13) ; // just after the "="
		szJustDate = decodeURIComponent ( szJustDate ) ;  // change %2F into "/"

		$.get( '/tbl1day.htm', function( page ) {
			console.log( '**** Demanem al server la taula on posar la ocupacio del dia ['+szJustDate+'].' ) ;
			$( "#content" ).html( page ) ; // show received HTML at specific <div>

// 2 - get "dades" for the table

			console.log( '*** consulta - demanem al server la llista de reserves per un dia. Data (%s)', myDate ) ; // output is "data_Reserva=2014/12/06"

// debugger;
			$.get( "/qui_te_reserves/" + myDate, function( dades ) {

				console.log( ">>> consulta - server response : ", dades ); // show whole JSON object
				
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
					var sz1User = "En {" + szNom + "} te la pista [" + szPista + "] el dia {" + szData + "} a les {" + szHora + "} " ;
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

	$('td.lliure').on('click',function(ev){
		//dia i hora i soci i pista construir serial...
	
		var targetID = $(this).attr('id') ;
		console.log( 'consulta - onclick td.lliure - el seu ID es {'+targetID+'}' ) ;
		  
		var clkPrefix = targetID.substring(0,3) ; // tdh10p3
		var clkPista  = targetID.substring(6,7) ; // tdh10p3
		var clkHora   = targetID.substring(3,5) ; // tdh10p3

		if ( clkPrefix == 'tdh' ) {

			var avui = $ ('#ocupacio_1_dia>thead>tr>th:nth-child(1)').text() ; // "2014%2F11%2F10"
			var soci = window.session.user.nom ;
			avui = encodeURIComponent(avui) ; // convert "/" into "%2F"

			console.log( 'consulta - fer reserva - pfx('+clkPrefix+') - pista '+clkPista+', hora '+clkHora+', soci '+soci+', data '+avui ) ;
			ferReserva( "Nom_Soci="+soci+"&Pista_Reserva="+clkPista+"&Dia_Reserva="+avui+"&Hora_Reserva="+clkHora, "#content" ) ; // client.js

		} else { // wrong prefix
		} ;
		return false ; // stop processing
 
    }); // OnClick - codi a executar quan piquem TD.LLIURE


	$('td.ocupada').on('click',function(ev){

		var targetID = $(this).attr('id') ;
		console.log( 'consulta - onclick td.ocupada - el seu ID es {'+targetID+'}' ) ;

		var targetUser = $(this).text() ;
		console.log( 'consulta - onclick td.ocupada - el seu USER es {'+targetUser+'}' ) ;

		var clkPrefix = targetID.substring(0,3) ; // tdh10p3
		var clkPista  = targetID.substring(6,7) ; // tdh10p3
		var clkHora   = targetID.substring(3,5) ; // tdh10p3

		if ( clkPrefix == 'tdh' ) {

			var avui = $ ('#ocupacio_1_dia>thead>tr>th:nth-child(1)').text() ; // "2014%2F11%2F10"
			var soci = window.session.user.nom ;
			avui = encodeURIComponent(avui) ; // convert "/" into "%2F"

			console.log( 'consulta - esborrar reserva - pfx('+clkPrefix+') - pista '+clkPista+', hora '+clkHora+', soci '+soci+', data '+avui ) ;

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
	$( "#myFormFerReserva" ).submit( function(event) {
	// will produce a msg as "GET /fer_una_reserva/Nom_Soci=nil&Pista_Reserva=0&Dia_Reserva=2000%2F01%2F01&Hora_Reserva=00"

		console.log( '[+] boto RESERVA polsat - fer una reserva.' ) ;
		
		ferReserva( $(this).serialize(), "#content" ) ; // client.js - common code with "do reservation from "consulta"
		
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

} ; // reserva_ready()


function esborra_ready() {

	console.log( '*** reserva DOM ready.' ) ;
	
	$( "#myFormEsborrarReserva input[name='Dia_Reserva_Esborrar']").datepicker( {dateFormat: "yy/mm/dd"} );
	$( "#myFormEsborrarReserva input[name='Dia_Reserva_Esborrar']").val( (new Date).yyyymmdd() );
	$( "#myFormEsborrarReserva input[name='Nom_Soci_Esborrar']" ).val( window.session.user.nom );
	
	$( "#myFormEsborrarReserva" ).submit( function(event) {
	// will produce a msg as "GET /esborrar_una_reserva/Nom_Soci=nil&Pista_Reserva=0&Dia_Reserva=2000%2F01%2F01&Hora_Reserva=00"

		console.log( '[+] boto ESBORRAR polsat - anular una reserva.' ) ;
		esborrarReserva( $(this).serialize(), "#content" ) ; // client.js - common code with "erase reservation from "consulta"
		return false ; // stop processing !!!

	}); // click "myFormEsborrarReserva" submit
		
} ; // esborra_ready()


function logon_ready() {

	console.log( '*** logon DOM ready.' ) ;

	
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

//		$.get( '/logonuser/'+myLogon, function( page ) {
//			console.log( '**** Demanem al server de fer LOGON() de un usuari.' ) ;
//			$( "#content" ).html( page ) ; // show received HTML at specific <div>
//		}) ; // get(logon)

		event.preventDefault(); // what is it for ?
 		$.ajax( {
			url: '/logonuser/'+myLogon,
			success : function( page ) { 
				$( "#content" ).html( page ) ;
				
				window.session.user.nom = logonUser ;
				$( "#watermark" ).html( '<p>Ara soc en {' + logonUser + '}.' ) ;
			},
			statusCode: {
				401: function() { $( "#content" ).html( '<p>Logon() not authorized</p>' ) },
				404: function() { $( "#content" ).html( '<p>Logon() unavailable   </p>' ) },
				500: function() { $( "#content" ).html( '<p>Logon() server error  </p>' ) }
			} 
		} ) ; // get(logon)
		
		return false ; // stop processing !!!
	
	}); // click "myFormReqLogon" submit

	
 	$( "#myFormReqLogoff" ).submit( function(event) {

		$.post( "/logoff_user", function( dades ) {
		
			console.log( ">>> Request logoff - server response (%s) : ", dades ); // show whole JSON object
			
			$( "#content" ).html( dades );  // or "text" - set server data onto actual page
			$( "#content" ).html( '<p>+++ Logged off successfully.</p>' ) ;
			
			delete window.session.user.nom ;
			$( "#watermark" ).html( '<p>Logged off.' ) ;

		}); // post( logoff )

		return false ; // stop processing !!!
		
	}); // click "myFormReqLogoff" submit
		
} ; // logon_ready()


function help_ready() {

	console.log( '*** help DOM ready.' ) ;
	
// posar la data actual a baix a l'esquerra
//	var szAvui = '<center>Avui es {' + window.session.avui + '}</center>' ;
//	$( "#my_date" ).html( szAvui ) ; // show actual date

    $("#clkConsultaAllReserves").click(function () {
        $.get('/dump_all_reserves', function ( page ) {
            console.log( "*** HELP.HTM - Demanem la llista de totes les reserves. Server response {%s}", page ) ;
            var lng = 0 ;
            lng = page.length ;
            console.log( '+++ Llargada (%s).', lng ) ;
			
            var texte = '<p class="pkon">';
            if ( lng > 0 ) {
                texte += "Dump all data in <i>reserves</i> DDBB. Hi ha (" + lng + ") reserves. <br>";
                var i = 0;
                while ( i < lng ) {
                    texte += "("+i+") la pista ("+page[i].rpista+") el dia ["+page[i].rdata+"] a les ["+page[i].rhora+"] hores";
					texte += " la te reservada en (" + page[i].rnom + ") - " ;
					texte += "ID [" + page[i]._id + "]" ;
					texte += " <br>" ;
                    i++;
                } // while
            } else {  // lng = 0
				texte += "Dump all data in <i>reserves</i> DDBB. No hi ha reserves. <br>";
			} ;
			texte += "</p>"
            $('#content').html(texte);  // or "text"
        }); // get()  
    }); // consulta all reserves


	$( "#clkPopulate" ).click( function() {
		$.get( '/populate', function( page ) {
			console.log( '**** HELP.HTM - Demanem al server omplir la BBDD.' ) ;
			$( "#content" ).html( page ) ; // show received HTML at specific <div>
		}) ; // get(populate)
	}) ; // populate


	$( "#clkPing" ).click( function() {
		$.get( '/ping', function( page ) {
			console.log( '**** HELP.HTM - Demanem al server un PING.' ) ;
			$( "#content" ).html( page ) ; // show received HTML at specific <div>
		}) ; // get(ping)
	}) ; // ping


	$( "#clkLinks" ).click( function() {
		$.get( '/links.htm', function( page ) {
			console.log( '**** HELP.HTM - Demanem al server la sub-pagina LINKS.' ) ;
			$( "#content" ).html( page ) ; // show received HTML at specific <div>
		}) ; // get(links)
	}) ; // links

	
    $("#clkConsultaAllUsers").click(function () {
        $.get('/dump_all_users', function ( page ) {
            console.log( "*** HELP.HTM - Demanem la llista de tots els usuaris. Server response {%s}", page ) ;
            var lng = 0 ;
            lng = page.length ;
            console.log( '+++ Llargada (%s).', lng ) ;
			
            var texte = '<p class="pkon">Dump all data in <i>users</i> DDBB. ';
            if ( lng > 0 ) {
                texte += "Hi ha (" + lng + ") usuaris. <br>";
                var i = 0;
                while ( i < lng ) {
                    texte += "("+i+") user (" + page[i].uAlias + ")";
					texte += " te (" + page[i].uNumReserves + ") reserves fetes" ;
					texte += " - ID [" + page[i]._id + "]" ;
					texte += " <br>" ;
                    i++;
                } // while
            } else { 
				texte += "No users defined yet.";
			} ; // lng = 0
			texte += "</p>"
            $('#content').html(texte);  // or "text"
        }); // get()  
    }); // consulta all reserves

	
} ; // help_ready()

 
$( function() {
	
    index_Ready(); // DOM ready event
  
} ) ; // DOM ready
