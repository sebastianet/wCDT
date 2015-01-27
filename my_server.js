
// servidor per al CDT - projecte "WCDT"
// Pere & Sebas, 2014 i 2015
// s'engega amb "node my_server.js"

// Want to be a SPA = http://en.wikipedia.org/wiki/Single-page_application, http://singlepageappbook.com/

// Versions (detailed text in HELP.HTM) :
//
// 1.2.d - remove bodyParser, deprecated
// 1.3.a - get LOGON.HTM from server into #content
// 2.1.d - populate()
// 2.2.a - draw a table to fill with some data 
// 2.2.b - enter then mongo data properly into the table
// 2.2.c - 20141222 - create a new reservation
// 2.2.d - 20141222 - fer un git al usb
// 2.2.e - 20141223 - verify the reservation space is free before reserving it
// 2.2.f - 20141224 - verify all paramaters are ok
// 2.2.g - 20150112 - 2 botons fan la mateixa feina si en lloc de ID posem CLASS
// 3.0.a - 20150113 - Font Awesome
// 4.0.a - 20150114 - Passport()


// Package install :
// npm install -g morgan       --save
// npm install -g body-parser  --save


// Pending :
// (*) catch "listen EADDRINUSE" - when Apache is running on port 80
// (*) veure el codi a Chrome
// (*) format de la data : ara es "own format"
// (*) passport : user/pwd
// (*) veure codi a reserves@pere : posar "monday..sunday" a sobre (if we display whole week)
// (*) tancar la conexio amb el mongo - quan es fa ?


// Let's go :

 var express    = require( 'express' ) ;          // http://expressjs.com/api.html#app.configure

 var http       = require( 'http' ) ;
 var logger     = require( 'morgan' ) ;       // logging middleware
 var bodyParser = require( 'body-parser' ) ;  // parser

 var monk       = require( 'monk' ) ;         // access to mongo

 var app = express() ;                        // instantiate Express and assign our app variable to it
 var db  = monk( 'localhost:27017/cdt' ) ;    // BBDD := "cdt" ;
 
// +++ app.configure( function () {

   app.set( 'port', process.env.PORT || 80 ) ;   // mind Apache !
   app.set( 'Title', 'My Koltrane Site' ) ;
   app.set( 'cname', "reserves_pistes" ) ;       // only place we have the collection name


// https://github.com/senchalabs/connect#middleware : list of officially supported middleware

   app.use( logger( "dev" ) ) ;                         // https://github.com/expressjs/morgan - tiny (minimal), dev (developer), common (apache)

// parse application/json and application/x-www-form-urlencoded
   app.use( bodyParser.json() ) ;

// serve static files and css
   app.get( '/*',express.static(__dirname + '/public') ) ; // serve whatever is in the "public" folder at the URL "/:filename"

 
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

   var texte = "Hello from Koltrane v 2.2.e<p>(" + datetime + ')<p> <a href="./index.htm">Back</a>' ;
   res.writeHead( 200, { 'Content-Type': 'text/html' } ) ; // write HTTP headers 
   res.write( texte ) ;
   res.end( ) ;
 }) ; // get '/ping'

 
// (2) populate ddbb (called from HELP page)

app.get( '/populate', function( req, res ){
    console.log( ">>> POPULATE ddbb." ) ;
	var CollectionName = app.get( 'cname' ) ;     // get collection name
    var MyCollection = db.get( CollectionName ) ; // get the collection

    MyCollection.drop( function(e) {              // drop old database and wait completion

		var My_Initial_Reserves = [ // see wines.js
			{ rdata: "2014/11/09", rhora: "09", rpista: "3", rnom: "sebas" },
			{ rdata: "2014/11/10", rhora: "11", rpista: "4", rnom: "pere" },
			{ rdata: "2014/11/10", rhora: "13", rpista: "4", rnom: "enric" },
			{ rdata: "2014/11/10", rhora: "13", rpista: "5", rnom: "anton" }
		] ;
	 
		MyCollection.insert( My_Initial_Reserves, { safe:true }, function( err, result ) {
	        if ( err ) { // send a HHTP error ? http://www.w3.org/Protocols/HTTP/HTRESP.html
                res.status( 500 ) ; // Internal Error
	            res.send( "--- there was a problem adding the information to the database." ) ; // If it failed, return error
	        } else { 
                res.status( 200 ) ; // OK
	            res.send( "+++ OK." ) ; // else, indicate OK.
	        } ; // else
		} ) ; // insert
	} ) ; // drop
	
} ) ; // get '/populate'


// (3) dump all reserves (called from HELP page)

app.get( '/dump_all_reserves', function( req, res ){
	console.log( ">>> GET ALL reserves : veure fins a 20 reserves de tots els dies." ) ;
	var CollectionName = app.get( 'cname' ) ; // get collection name
    var MyCollection = db.get( CollectionName ) ; // get the collection
	MyCollection.find( {  }, { limit: 20 }, function( err, docs ){ // empty filter
        var  i = docs.length ;
        console.log( "+++ the collection (%s) for all dates has (%s) elements.", CollectionName, i ) ;
        res.json( docs ) ; // send JSON object
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
        console.log( "+++ the collection for that date has (%s) elements.", i ) ;
        res.json( docs ) ; // send JSON object
	}) ; // find()

}); // get '/qui_te_reserves/data_Reserva=:dia_consultat'


// (5) fer una reserva nova
// start with a msg as "GET /fer_una_reserva/Nom_Soci=nil&Pista_Reserva=0&Dia_Reserva=2000%2F01%2F01&Hora_Reserva=00"

app.post( '/fer_una_reserva/Nom_Soci=:res_nom_soci&Pista_Reserva=:res_pista&Dia_Reserva=:res_dia&Hora_Reserva=:res_hora', function( req, res ){

	var Reserva_NomSoci = req.params.res_nom_soci ;
	var Reserva_Pista   = req.params.res_pista ;
	var Reserva_Dia     = req.params.res_dia ;
	var Reserva_Hora    = req.params.res_hora ;
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
						res.send( "+++ reserva feta OK." ) ; // else, indicate OK.
					} ; // if Error
				} ) ; // insert
			
			} else { // else, tell customer the slot is not free

				var QuiEs = '' ;
				if ( i == 1 ) {
					QuiEs = docs[0].rnom ;
				} ;
				szResultat = "--- ("+i+") slot ocupat per en (" + QuiEs + ")." ;
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

   
// create our http server and launch it
http.createServer( app ).listen( app.get( 'port' ), function() {
    console.log( 'Express server v 4.0.a listening on port ' + app.get( 'port' ) ) ;
} ) ;
