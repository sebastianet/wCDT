
// Pere & Sebas, 2014 i 2015
// servidor per al CDT - projecte "WCDT"
// github : https://github.com/sebastianet/wCDT
// s'engega amb "node my_server.js" (veure "package.json")

// Want to be a SPA = http://en.wikipedia.org/wiki/Single-page_application, http://singlepageappbook.com/

// Versions (more detailed than in HELP.HTM)
//     Numeracio : 1 lloc aqui (var "myVersio") i 2 llocs a INDEX.HTM
//
// 1.2.d - remove bodyParser, deprecated
// 1.3.a - get LOGON.HTM from server into #content
// 2.0.a - use jQuery() and Ajax.
// 2.1.d - populate()
// 2.2.a - draw a table to fill with some data 
// 2.2.b - enter then mongo data properly into the table
// 2.2.c - 20141222 - create a new reservation
// 2.2.d - 20141222 - fer un git al usb
// 2.2.e - 20141223 - verify the reservation space is free before reserving it
// 2.2.f - 20141224 - verify all paramaters are ok
// 2.2.g - 20150112 - 2 botons fan la mateixa feina si en lloc de ID posem CLASS
// 3.0.a - 20150113 - use Font Awesome
// 4.0.a - 20150114 - use Passport()
// 4.0.b - 20150128 - fix "monk" in package.json, serve "index.htm"
// 4.0.c - 20150206 - catch ddbb.find() error
// 4.0.d - 20150209 - dump mongo ID's (start delete). February month.
// 4.1.a - 20150211 - reorganitzem el codi per veure-ho tot al debugger - CLIENT.JS
// 4.1.b - 20150215 - esborrar reserva
// 4.1.c - 20150218 - improve some messages
// 4.1.d - 20150219 - HOURS must always be 2-digit. DatePicker(). HourSelector(). jQueryUI : User Interface.
// 4.1.e -          .

// Package install :
// npm install -g morgan       --save
// npm install -g body-parser  --save

// Problemes :
//  *) si fem click en un TD lliure pero no sobre el FLAG, dona error (es veu si tenim Chrome + F12)
//  *) *** index - demanem al server la sub-pagina CONSULTA.
//         Synchronous XMLHttpRequest on the main thread is deprecated because of its detrimental effects to the end user's experience. For more help, check http://xhr.spec.whatwg.org/.

// Pending :
// (*) fer click al mes del calendari i posar-ho a la variable global i despres al boto de consultes
// (*) catch "listen EADDRINUSE" - when Apache is running on port 80
// (*) format de la data : ara es "own format"
// (*) passport : user/pwd
// (*) veure codi a reserves@pere : posar "monday..sunday" a sobre (if we display whole week)
// (*) tancar la conexio amb el mongo - quan es fa ?

// Dubtes :
// *) a INDEX.HTM + DOM Ready() fem  : window.session.user = {} ;        // set "no user" at begin
//    si re-carreguem la pagina es perd el usuari ?

// Let's go :

 var myVersio   = "v 4.1.d" ;                    // mind 2 places in /public/INDEX.HTM

 var express    = require( 'express' ) ;         // http://expressjs.com/api.html#app.configure
// var session    = require('express-session') ;      // express session
// var  cookieParser = require('cookie-parser) ;      // data cookies
// app.use( coookieParser('secretSebas') ) ;          // pwd to encrypt all cookies 

 var http       = require( 'http' ) ;
 var logger     = require( 'morgan' ) ;          // logging middleware
 var bodyParser = require( 'body-parser' ) ;     // parser

 var monk       = require( 'monk' ) ;            // access to mongo

 var app = express() ;                           // instantiate Express and assign our app variable to it
 var db  = monk( 'localhost:27017/cdt' ) ;       // BBDD := "cdt" ;
 
// +++ app.configure( function () {

   app.set( 'port', process.env.PORT || 80 ) ;   // mind Apache !
   app.set( 'Title', 'My Koltrane Site' ) ;
   app.set( 'cname', "reserves_pistes" ) ;       // this is only place we have the collection name


// https://github.com/senchalabs/connect#middleware : list of officially supported middleware

   app.use( logger( "dev" ) ) ;                         // https://github.com/expressjs/morgan - tiny (minimal), dev (developer), common (apache)

// parse application/json and application/x-www-form-urlencoded
   app.use( bodyParser.json() ) ;

// serve static files and css
//   app.get( '/*', express.static( __dirname + '/public' ) ) ; // serve whatever is in the "public" folder at the URL "/:filename"

   var staticPath    =  __dirname + '/public';
   var staticOptions = { index: 'index.htm' };  // provide "index.htm" instead of the default "index.html"

   app.get( '/*', express.static( staticPath, staticOptions ) ) ;  // configure express options

 
// Lets set some routes :


// (1) if customers asks for a "ping", we send actual date and a link back to main page :

app.get( '/ping', function(req,res) {
   var currentdate = new Date();
   var datetime = "Last Sync: " + currentdate.getDate() + "/"
				+ (currentdate.getMonth()+1)  + "/"
				+ currentdate.getFullYear() + " @ "
				+ currentdate.getHours() + ":"
				+ currentdate.getMinutes() + ":"
				+ currentdate.getSeconds() ;

   var texte = "Hello from Koltrane "+myVersio+"<p>(" + datetime + ')<p> <a href="./index.htm">Back</a>' ;
   res.writeHead( 200, { 'Content-Type': 'text/html' } ) ; // write HTTP headers 
   res.write( texte ) ;
   res.end( ) ;
 }) ; // get '/ping'

 
// (2) populate ddbb (called from HELP page)

app.get( '/populate', function( req, res ){
    
	var CollectionName = app.get( 'cname' ) ;     // get collection name
    var MyCollection = db.get( CollectionName ) ; // get the collection
	console.log( ">>> POPULATE ddbb (" + MyCollection.name + ")." ) ;

    MyCollection.drop( function(e) {              // drop old database and wait completion

		var My_Initial_Reserves = [ // see wines.js
			{ rdata: "2014/11/09", rhora: "09", rpista: "3", rnom: "sebas" },
			{ rdata: "2014/11/10", rhora: "11", rpista: "4", rnom: "perea" },
			{ rdata: "2014/11/10", rhora: "13", rpista: "4", rnom: "enric" },
			{ rdata: "2014/11/10", rhora: "13", rpista: "5", rnom: "anton" }
		] ;
	 
		MyCollection.insert( My_Initial_Reserves, { safe:true }, function( err, result ) {
	        if ( err ) { // send a HHTP error ? http://www.w3.org/Protocols/HTTP/HTRESP.html
                res.status( 500 ) ; // Internal Error
	            res.send( "--- populate : there was a problem adding the information to the database." ) ; // If it failed, return error
	        } else { 
                res.status( 200 ) ; // OK
	            res.send( "+++ ddbb (" + MyCollection.name + ") populated OK." ) ; // else, indicate OK.
	        } ; // else
		} ) ; // insert
	} ) ; // drop
	
} ) ; // get '/populate'


// (3) dump all reserves (called from HELP page)

app.get( '/dump_all_reserves', function( req, res ){
	
	console.log( ">>> GET ALL reserves : veure fins a 20 reserves de tots els dies." ) ;
	var CollectionName = app.get( 'cname' ) ;     // get collection name
    var MyCollection = db.get( CollectionName ) ; // get the collection

	MyCollection.find( {  }, { limit: 20 }, function( err, docs ){ // empty filter
	    if ( err ) { 
            console.log( "--- error accessing DDBB (%s).", CollectionName ) ;
            res.status( 500 ) ; // internal error
            res.send( {'error':'dump all DDBB error.'} ) ;
        } else {
            var  i = docs.length ;
            console.log( "+++ the collection (%s) for all dates has (%s) elements.", CollectionName, i ) ;
            res.json( docs ) ; // send JSON object
		} ;
	}) ; // find()

}); // get '/dump_all_reserves'


// (4) mostrar les reserves que hi ha per un dia donat
// start with a msg as "GET /qui_te_reserves/data_Reserva=2014/12/06"
// "data_Reserva" surt del "name" del input field en el "form"

app.get( '/qui_te_reserves/data_Reserva=:dia_consultat', function( req, res ){
	
    var DiaConsultat = req.params.dia_consultat ; // if BLANK then 404 ;
	console.log( ">>> GET veure reserves 1 dia : veure fins a 20 reserves del dia (%s) ", DiaConsultat ) ;
	
	var CollectionName = app.get( 'cname' ) ;     // get collection name
   	var MyCollection = db.get( CollectionName ) ; // get the collection
	
	MyCollection.find( { rdata: DiaConsultat }, { limit: 20 }, function( err, docs ){ 
        var  i = docs.length ;
        console.log( "+++ the collection (%s) for the date (%s) has (%s) elements.", CollectionName, DiaConsultat, i ) ;
        res.json( docs ) ; // send JSON object
	}) ; // find()

}); // get '/qui_te_reserves/data_Reserva=:dia_consultat'


// (5) fer una reserva nova
// start with a msg as "GET /fer_una_reserva/Nom_Soci=nil&Pista_Reserva=0&Dia_Reserva=2000%2F01%2F01&Hora_Reserva=00"

app.post( '/fer_una_reserva/Nom_Soci=:res_nom_soci&Pista_Reserva=:res_pista&Dia_Reserva=:res_dia&Hora_Reserva=:res_hora', function( req, res ){

	var Reserva_NomSoci = req.params.res_nom_soci ;
	var Reserva_Pista   = req.params.res_pista ;
	var Reserva_Dia     = req.params.res_dia ;
//	if ( Reserva_Dia < 10 ) { Reserva_Dia = '0' + Reserva_Dia } ;
	var Reserva_Hora    = req.params.res_hora ;
//	if ( Reserva_Hora < 10 ) { Reserva_Hora = '0' + Reserva_Hora } ;
	console.log( ">>> POST fer una nova reserva. Nom (%s), pista (%s), dia (%s), hora (%s).", Reserva_NomSoci, Reserva_Pista, Reserva_Dia, Reserva_Hora ) ;
	
	var CollectionName = app.get( 'cname' ) ;     // get collection name
	var MyCollection = db.get( CollectionName ) ; // get the collection
	
	var MyReserva = { rnom: "", rpista: "", rdata: "", rhora: "" } ;  // new object with empty fields
	MyReserva.rnom   = Reserva_NomSoci ;
	MyReserva.rpista = Reserva_Pista ;
	MyReserva.rdata  = Reserva_Dia ;
	MyReserva.rhora  = Reserva_Hora ;

// mirem que tots els parametres siguin correctes :

    var iTotOK = 1 ;  // de moment, tot OK
	var szErrorString = "" ;
	var szResultat = "" ;
	
	if ( ( Reserva_Pista < 3 ) || ( Reserva_Pista > 5 ) ) {
		szErrorString = "Numero de pista erroni (" + Reserva_Pista + ")" ;
		iTotOK = 0 ;  // indicate error in parameters
	} ;
	if ( ( Reserva_Dia < 1 ) || ( Reserva_Dia > 31 ) ) {
		szErrorString = "Dia erroni (" + Reserva_Dia + ")" ;
		iTotOK = 0 ;  // indicate error in parameters
	} ;

	if ( ( Reserva_Hora < 9 ) || ( Reserva_Hora > 20 ) ) {
		szErrorString = "Hora erronia (" + Reserva_Hora + ")" ;
		iTotOK = 0 ;  // indicate error in parameters
	} ;
	
	if ( iTotOK == 1 ) {  // parameters ok
	
// mirem si aquesta pista ja esta ocupada aquest dia i hora :

		MyCollection.find( { rdata: Reserva_Dia, rhora: Reserva_Hora, rpista: Reserva_Pista }, { limit: 20 }, function( err, docs ){ 
		
			var  i = docs.length ;
			console.log( "+++ the slot for that moment has (%s) elements.", i ) ;

			if ( i < 1 ) { // si no esta ocupat, la reservem
		
				console.log( 'Afegim una reserva : ' + JSON.stringify( MyReserva ) ) ;
				
				MyCollection.insert( MyReserva, { safe:true }, function( err, result ) {
					if ( err ) {
						console.log( '---- Could not insert reservation into MongoDB.' ) ;
						res.status( 500 ) ; // internal error
						res.send( {'error':'An error has occurred'} ) ;
					} else {
						console.log( '++++ Success: insert went ok.' ) ;
						res.status( 200 ) ; // OK
						res.send( "+++ fer reserva OK. User("+Reserva_NomSoci+"), pista("+Reserva_Pista+"), dia("+Reserva_Dia+"), hora("+Reserva_Hora+")." ) ; // else, indicate OK.
					} ; // if Error
				} ) ; // insert
			
			} else { // else, tell customer the slot is not free

				var QuiEs = '' ;
				if ( i == 1 ) {
					QuiEs = docs[0].rnom ;
				} ;
				szResultat = "--- Error Reserva - ("+i+") slot Pista("+Reserva_Pista+") Dia("+Reserva_Dia+") Hora("+Reserva_Hora+") ocupat per en (" + QuiEs + ")." ;
				res.status( 200 ) ;      // OK as HTTP rc, but
				res.send( szResultat ) ; // else, indicate no OK.
			
			} ;  // if did exist
		}) ; // find()

	} else {  // error en algun parametre
		res.status( 200 ) ; // OK
		szResultat = "--- Parametre incorrecte (" + szErrorString + ")." ;
		res.send( szResultat ) ; // else, indicate no OK.
	} ; // iTotOK
	
}); // get '/fer_una_reserva/<parametres>'


// (6) esborrar una reserva 
// start with a msg as "GET /esborrar_una_reserva/Nom_Soci=nil&Pista_Reserva=0&Dia_Reserva=2000%2F01%2F01&Hora_Reserva=00"

// Podem esborrar una reserva si :
//    *) som el seu propietari (o som el Administrador)
//    *) la data es "futura", es a dir, que no s'ha jugat

app.post( '/esborrar_una_reserva/Nom_Soci_Esborrar=:res_nom_soci&Pista_Reserva_Esborrar=:res_pista&Dia_Reserva_Esborrar=:res_dia&Hora_Reserva_Esborrar=:res_hora', function( req, res ){
	
	var Esborra_Reserva_NomSoci = req.params.res_nom_soci ;
	var Esborra_Reserva_Pista   = req.params.res_pista ;
	var Esborra_Reserva_Dia     = req.params.res_dia ;
	var Esborra_Reserva_Hora    = req.params.res_hora ;
	console.log( ">>> POST esborrar una reserva. Nom (%s), pista (%s), dia (%s), hora (%s).", Esborra_Reserva_NomSoci, Esborra_Reserva_Pista, Esborra_Reserva_Dia, Esborra_Reserva_Hora ) ;

	var CollectionName = app.get( 'cname' ) ;     // get collection name
	var MyCollection = db.get( CollectionName ) ; // get the collection
	
	var MyEsborraReserva = { rnom: "", rpista: "", rdata: "", rhora: "" } ;  // new object with empty fields
	MyEsborraReserva.rnom   = Esborra_Reserva_NomSoci ;
	MyEsborraReserva.rpista = Esborra_Reserva_Pista ;
	MyEsborraReserva.rdata  = Esborra_Reserva_Dia ;
	MyEsborraReserva.rhora  = Esborra_Reserva_Hora ;

	MyCollection.find( { rdata: Esborra_Reserva_Dia, rhora: Esborra_Reserva_Hora, rpista: Esborra_Reserva_Pista }, { limit: 20 }, function( err, docs ){ 
	
		var  i = docs.length ;
		console.log( "+++ Remove reserva - the slot for that moment has (%s) elements.", i ) ;

		if ( i < 1 ) { // si no esta ocupat, es un error
		
				szResultat = "--- Error esborrant reserva - ("+i+") slot lliure." ;
				res.status( 200 ) ;      // OK as HTTP rc, but
				res.send( szResultat ) ; // else, indicate no OK.

		} else { // else, the slot is not free so we can remove it
		
			var ObjectIdPerEsborrar = docs[0]._id ;
			var UsuariPerEsborrar   = docs[0].rnom ;
			console.log( 'Esborrem la reserva de ID [' + ObjectIdPerEsborrar + '].' ) ;
			MyCollection.remove( {"_id": ObjectIdPerEsborrar }, { safe:true }, function( err, result ) {
				if ( err ) {
					console.log( '---- Could not remove reservation from MongoDB.' ) ;
					res.status( 500 ) ; // internal error
					res.send( {'error':'An error has occurred'} ) ;
				} else {
					console.log( '++++ Esborrar Reserva Success: remove went ok.' ) ;
					res.status( 200 ) ; // OK
					res.send( "+++ esborrar reserva OK. User("+UsuariPerEsborrar+"), pista("+Esborra_Reserva_Pista+"), dia("+Esborra_Reserva_Dia+"), hora("+Esborra_Reserva_Hora+")." ) ; // else, indicate OK.
				} ; // if Error

			} ) ; // remove
		} ;  // if did exist

	}) ; // find()
			
}); // get '/esborrar_una_reserva/<parametres>'


// create our http server and launch it
http.createServer( app ).listen( app.get( 'port' ), function() {
    console.log( 'Express server '+myVersio+' listening on port ' + app.get( 'port' ) ) ;
} ) ;
