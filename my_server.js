
//
// Pere & Sebas, 2014 i 2015
// Projecte "WCDT" - servidor web per reservar pistes al CDT
//
// Repositori : github : https://github.com/sebastianet/wCDT
//
// Sequencia d'engegada :
//    1) engegar el MongoDB
//    2) "node my_server.js" (veure "package.json" - npm run)
//    3) finalment, cal obrir el client a la URL https://ip/ 
//           compte - hem de fer servir HTTPS des la versio 5.0
//
// Configuracio :
//
//    *) s'ha de posar la IP en el lloc de "localhost" en la variable "host" 
//    *) al subdirectori "config" hi ha 4 fitxers :
//           app.js    - valors relatius a l'aplicacio, as iMaxReserves:
//           codi.js   - codi base per accedir als 3 fiters de configuracio
//           db.js     - acces a la base de dades
//           usrpw.js  - usuaris i passwords
//
// Emulacio Bluemix :
//    *) configurar process.env.VCAP_SERVICES
//        szDB = JSON.parse( process.env.VCAP_SERVICES )['mongolab'][0].credentials.uri ;  
//        var host = ( process.env.VCAP_APP_HOST || process.env.WCDTHOST || 'localhost' ) ;
//        var port  = ( process.env.VCAP_APP_PORT || 80 ) ;
//        var portS = ( process.env.VCAP_APP_PORT || process.env.WCDTPORT || 443 ) ;
//

// Project files and folders structure :
//
// <actual directory>
//     |
//    my_server.js             this is server's code
//    config.js                configuration values
//    mimdwr.js                middleware code
//    <public>
//    .  |
//    .  consulta.htm
//    .  esborra.htm
//    .  help.htm
//    .  index.htm
//    .  links.htm
//    .  logon.htm
//    .  admin.htm
//    .  <css>
//    .      |
//    .     sebas.css
//    <sslcert>
//    .  |
//    .  server.crt
//    .  server.key
//

// DataBases structure (2)
//
//    Reserves :
//
//        { 
//          rdata:  "2014/11/09", 
//          rhora:  "09", 
//          rpista: "3", 
//          rnom:   "sebas" 
//        }
//
//    Usuaris :
//
//				uAlias        : "sebas", 
//				uPwd          : "sebastia2015", 
//              uRole         : "Administrator" / "Guest"
//				uNom          : "Sebastia Altemir",
//				uEmail        : "sebastiasebas@gmail.com",
//				uLastLogin    : "2015/01/01",
//              uEstat        : actiu / bloquejat / iniciantse
//				uMisc         : "-" 
//
// Access using browser :
//    http://127.0.0.1:28017/cdt/wCDT_users/?filter_uAlias=guest
//    http://localhost:28017/
//

// Versions (more detailed than in HELP.HTM)
//
// 1.2.d - remove bodyParser, deprecated
// 1.3.a - get LOGON.HTM from server into #content
// 2.0.a - use jQuery() and Ajax
// 2.1.d - populate()
// 2.2.a - draw a table to fill with some data 
// 2.2.b - enter then mongo data properly into the table
// 2.2.c - 20141222 - create a new reservation
// 2.2.d - 20141222 - fer un git al usb
// 2.2.e - 20141223 - verify the reservation space is free before reserving it
// 2.2.f - 20141224 - verify all paramaters are ok
// 2.2.g - 20150112 - 2 botons fan la mateixa feina si en lloc de ID posem CLASS
// 3.0.a - 20150113 - use Font Awesome - http://fortawesome.github.io/Font-Awesome/
// 4.0.a - 20150114 - use Passport() - http://passportjs.org/ jQueryUI - http://jqueryui.com/themeroller/
// 4.0.b - 20150128 - fix "monk" in package.json, serve "index.htm"
// 4.0.c - 20150206 - catch ddbb.find() error
// 4.0.d - 20150209 - dump mongo ID's (start delete). February month
// 4.1.a - 20150211 - reorganitzem el codi per veure-ho tot al debugger - CLIENT.JS
// 4.1.b - 20150215 - esborrar reserva
// 4.1.c - 20150218 - improve some messages
// 4.1.d - 20150218 - DatePicker(). HourSelector(). jQueryUI : User Interface
// 4.1.e - 20150218 - load subPage "initial.htm" so we dont lose user's properties
// 4.1.f - 20150219 - posar la data actual a totes les funcions
// 4.2.a - 20150221 - BBDD usuaris. Display mongo error text (err.message) if any
// 4.2.b - 20150221 - cath logon failure
// 4.2.c - 20150222 - display user data at logon 
// 4.2.d - 20150223 - populate() does not drop() so we keep old data
// 5.0.a - 20150223 - use HTTPS - https://nodejs.org/api/https.html#https_https
// 5.0.b - 20150224 - show user's ddbb contents from help
// 5.0.c - 20150224 - allow "fer reserva" only in logged in
// 5.0.d - 20150224 - create logoff() button
// 5.1.a - 20150225 - use session
// 5.1.b - 20150226 - send messages to client with user name
// 5.1.c - 20150305 - verify user is logged in before "fer reserva" from consulta
// 5.1.d - 20150311 - allow "esborrar reserva" only in logged in, also from consulta
// 5.1.e - 20150312 - verify date is in the future (in fer reserva and also delete reserva)
// 5.1.f - 20150313 - display actual reservas when logon()
// 5.1.g - 20150314 - display actual reservas when logoff()
// 5.1.h - 20150316 - link to logon() in INITIAL.HTM
// 5.1.i - 20150318 - get_ocupacio only future days
// 5.1.j - 20150321 - CSS i JS de index.htm en local - "mixed content" problem
// 5.1.k - 20150321 - remove "uNumReserves" from "users" database
// 5.1.l - 20150321 - list users DDBB from ADMIN menu
// 5.1.m - 20150322 - local CSS and JS
// 5.1.n - 20150322 - "admin" menu - list users and drop users ddbb. new menu, as list collections. 
// 5.1.o - 20150323 - use "err.errno"
// 5.1.p - 20150323 - DB create/list/delete, COL(users/reserves) create/list/delete. Enter admin if ENV.wcdtFOO is properly set.
// 5.2.a - 20150324 - prepare for bluemix - mongo now is remote and external
//                        (bmx-1) mongo
//                        (bmx-2) port
//                        (bmx-3) redirect
//                        (bmx-4) 2 servers in local, one in bluemix
// 5.2.b - 20150324 - read DOCS length only if no ERROR.
// 5.2.c - 20150324 - details on how server stores data in SESSION.REQ
// 5.2.d - 20150325 - all possible modules installed global, so bluemix upload is shorter
// 5.2.e - 20150325 - use config.js and dont use app.set; create users collection if no existent at server startup - pwd from ENV.wcdtFOO (not used yet)
// 5.2.f - 20150326 - display /admin link if user "has powers"
// 5.2.g - 20150326 - alta de usuario desde /admin
// 5.2.h - 20150327 - trace logged user - bluemix loses it
// 5.2.i - 20150408 - esborrar usuari del titol when logoff()
// 5.2.j - 20150409 - get HOST (ip) and PORT from Envir - "localhost" does now receive remote requests
// 5.2.k - 20150409 - link to our APP in BlueMix at LINKS
// 5.2.l - 20150416 - admin user can delete old reservas
// 5.3.a - 20150416 - cant delete reserva if not the owner (except administrators)
// 5.4.a - 20150417 - trace all cookies
// 5.4.b - 20150417 - send signed and secured cookie
// 5.5.a - 20150419 - esborrar usuari de la bbdd
// 5.6.a - 20150420 - move middleware code to file "mimdwr.js"
// 5.6.b - 20150421 - trace remove reserva params (ESP)
// 5.6.c - 20150421 - send TITLE cookie
// 5.6.d - 20150421 - no admin commands in help page
// 5.6.e - 20150422 - send browser cookie - client displays it in HELP page
// 5.6.f - 20150429 - display max number of pending reservations at GetOcupacio
// 5.6.g - 20150429 - display hostname : client's hn at server console, server's hn at client screen
// 5.7.a - 20150430 - diversos fitxers de configuracio en el directori CONFIG
// 5.8.a - 20150430 - ukCDT amb usuari intern
// 5.9.a - 20150502 - at logon(), ask server for user and host
// 5.A.a - 20150503 - trace user in session field at logoff : somehow it is not "deleted" - fixed {***}
// 5.B.a - 20150504 - fixed esborrar usuari en logoff
// 5.B.b - 20150504 - server hostname is in req.headers.host and also in req.session.wcdt_hostname (from 'os')
// 5.B.c - 20150504 - try to display client ip using req.ip
// 5.B.d - 20150504 - try to display client ip using req.ip
// 5.B.e - 20150512 - manage MaxNumReserves
// 5.B.f - 20150512 - verify free slots prior doing reserva()
// 5.B.g - 20150526 - modificacions simplificacio funcionament
// 5.B.h - 20150527 - mes millores i simplificacio funcionament i missatges
// 5.B.i - 20150529 - si logon() falla, posar timestamp, user (and host)
// 5.B.j - 20150612 - dont set consulta date everytime page is loaded - keep the "datepicker" value
// 5.B.k - 20150613 - save Data Darrera Consulta in session and send as cookie
// 5.B.l - 20150613 - display server version cookie in "help" screen, server version in initial msg at server.
// 5.B.m - 20150613 - fix display user at logoff
// 5.B.n - 20150613 - set server hostname cookie after initial message
// 5.B.o - 20150614 - set readonly="true" al camp d'entrada de la data a consultar - el datapicker funciona !
// 5.B.p - 20150627 - install and run under nodemon
//

// Bluemix :
// (1) url = https://console.ng.bluemix.net/home ; SignIn ( usr = mrblacula@gmail.com ) ; .eu-gb. or .ng.
// (2) cf api https://api.ng.bluemix.net ( US South cloud )
// (3) cf login -u mrblacula@gmail.com -o mrblacula@gmail.com -s dev
// (4) cf logs usCDT
// (5) cf push usCDT
// (6) BlueMix console : https://console.ng.bluemix.net/home
// (7) APP : https://uscdt.mybluemix.net/
// (8) cf logout
//
// Mind manifest.yml - see http://docs.cloudfoundry.org/devguide/deploy-apps/manifest.html
//

// APP own variables
//    Title
//    iMaxReservesUsuari
//    rcolnbame
//    userscolname 
//    appHostname
//
// Server own variables                - filled up at what moment ?
//    req.session.wcdt_nomsoci         - logon()
//    req.session.wcdt_tipussoci       - logon()
//    req.session.wcdt_instant_inicial - logon()
//    req.session.wcdt_lastlogon       - logon()
//    req.session.wcdt_hostname        - logon() - moved to own middleware
//    req.session.wcdt_diaconsultat    - consulta()
//
//  Client own variables :
//    window.session.user.nom

// Cookies sent to client :
//    kukTIT   - title
//    kukHN    - hostname (server)
//    kukHNCLI - hostname (client)
//    kukVER   - code version
//

// Package install :
//   npm install body-parser      -g --save  + npm link body-parser
//   npm install cookie-parser    -g --save  + npm link cookie-parser
//   npm install express          -g --save  + npm link express
//   npm install express-session  -g --save  + npm link express-session
//   npm install mongodb          -g --save  + npm link mongodb
//   npm install monk             -g --save  + npm link monk
//   npm install morgan           -g --save  + npm link morgan

// Want to be a SPA = http://en.wikipedia.org/wiki/Single-page_application, http://singlepageappbook.com/
// The main page (index.htm) is loaded only once.
// The rest of the changes are created changing the subpage indicated by "#content" tag, where the following subpages are loaded:
//     consulta.htm
//     reserva.htm
//     esborra.htm
//     logon.htm
//     help.htm
//     initial.htm
//     admin.htm
//     links.htm
//
// All of them have a "DOM ready" event coded in a common "client.js" file, loaded in index.htm so the code is available to debugger.

// To debug "server" code, we use node-inspector :
//   (1) start "dbg" node-inspector             = engegar debugger 
//   (2) start "app" node --debug my_server.js  = start application
//   (3) http://127.0.0.1:8080/debug?port=5858  = open debug browser 
//   (4) https://9.137.165.71/index.htm         = open application browser 
//
// To debug "client" code, use Chrome + F12 + "Console" tab
//   It usually shows up a line like "Uncaught Syntax Error : Unexpected token ), file client.js, line 508"

// Problemes :
//  *) si fem click en un TD lliure pero no sobre el FLAG, dona error (es veu si tenim Chrome + F12)
//  *) *** index - demanem al server la sub-pagina CONSULTA.
//         Synchronous XMLHttpRequest on the main thread is deprecated because of its detrimental effects to the end user's experience. For more help, check http://xhr.spec.whatwg.org/.
//  *) com evitar " GET https://maxcdn.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css net::ERR_CONNECTION_REFUSED "
//  *) HTTPS + "mixed content" - local jQuery.js and others
//  *) XMLHttpRequest cannot load https://bcdt.eu-gb.mybluemix.net/logonuser/nom_Logon=pere&pwd_Logon=pere2015. 
//         No 'Access-Control-Allow-Origin' header is present on the requested resource. 
//         Origin 'http://bcdt.eu-gb.mybluemix.net' is therefore not allowed access. The response had HTTP status code 401.

// Pending :
// (*) alta soci = fill the fields (nom, tf, email) and click button, not actual email.
// (*) oblit contrasenya - enter email and click button, not actual email.
// (*) canvi contrasenya - fill the fields (nom, old, new) and click button, not actual email.
// (*) site map
// (*) "about wCDT project"
// (*) health report
// (*) check for updates - get a new JS using cron(git pull) and then use "https://github.com/petruisfan/node-supervisor"
// (*) donate (PayPal)
// (*) Jordi Morillo - treure codi de formateig (links d'administracio) del client
//        No servir pagines de administradors si no ve la cookie adient : que passa si el client demana URL = https://9.137.165.71/admin.htm ?
// (*) ESP - puc fer una reserva per 20154010 o 32 de Juny
// (*) ESP - a les 11h puc fer una reserva per les 09h
// (*) en fer logon, comprovar que el usuari no estigui ja logonejat de un altre lloc
// (*) access the application from a mobile client
// (*) estat del usuari = "iniciant-se" si li hem enviat el email pero no ha clikat al link d'activacio
// (*) transaction log = empty database + re-evaluate(transaction log) => actual database
// (*) bitacora : <id> <time> <who> <what> <params> <status>
// (*) enviar e-mail quan s'accepti un nou usuari i es posi a la bbdd - ha de contenir link de "activacio" ? bbdd usuaris te un "estat" intermig ?
// (*) fer click al mes del calendari i posar-ho a la variable global i despres al boto de consultes
// (*) catch "listen EADDRINUSE" - when Apache is running on port 80
// (*) detect "already running" monitorig own port maybe
// (*) format de la data : ara es "own format"
// (*) compte que des teclat es pot entrar una hora de valor "9" mentre que internament fem servir sempre "09"
// (*) veure codi a reserves@pere : posar "monday..sunday" a sobre (if we display whole week)
// (*) tancar la conexio amb el mongo - quan es fa ?
// (*) package.json : com sap com engegar : "start": "node my_server.js" - de quan hem fet "npm init" i hem contestat preguntes
// (*) passport : user/pwd
// (*) tenir la PWD al mongo "hashed"
// (*) canvi de proporcions en canviar de pantalla (al W500 surt malament)
// (*) posar un rellotge JS en alguna part fixe, que mostri moviment continuament
// (*) posar un calendari del mes i omplir "data request ocupacio" amb un click
// (*) executar el codi sota un supervisor que faci reload, as
//		http://nodemon.io/ (desenvolupament)
//		https://github.com/petruisfan/node-supervisor
//		https://github.com/foreverjs/forever (produccio)
//     i posar un cron que faci un "git pull" i "npm update"
// (*)
//

// Dubtes :
//    on vaig veure que deia "cookie-parser not required since version ...
//

// Missatges numerats :
//    "+++ WCDT0001 - logon and PWD OK."
//    "+++ WCDT0002 - logoff user {"+ req.session.wcdt_nomsoci + "}. "
//    "--- WCDT0003 - Error Reserva - cant delete old reserva if not logged"
//    "--- WCDT0004 - CANT do a new reserva - soci ["+ req.session.wcdt_nomsoci +"] not logged in."
//    "--- WCDT0005 - tu {" + Esborra_Reserva_NomSoci + '/' + req.session.wcdt_nomsoci + '/' + req.session.wcdt_tipussoci + "} no pots esborrar una reserva d'en (" + UsuariPerEsborrar + ")." ;
//

// Let's go :

	var myVersio     = "v5.B.p" ;                        // (oldie - mind 2 places in /public/INDEX.HTM)

	var express      = require( 'express' ) ;            // http://expressjs.com/api.html#app.configure
	var session      = require( 'express-session' ) ;    // express session - https://github.com/expressjs/session ; https://www.npmjs.com/package/express-session
	var cookieParser = require( 'cookie-parser' ) ;      // data cookies
 	var bodyParser   = require( 'body-parser' ) ;        // parser

	var http         = require( 'http' ) ;
	var https        = require( 'https' ) ;
	var logger       = require( 'morgan' ) ;             // logging middleware
	var fs           = require( 'fs' ) ;                 // r/w files
	var monk         = require( 'monk' ) ;               // access to mongodb
	var mongo        = require( 'mongodb' ) ;            // connect to mongodb

	var privateKey  = fs.readFileSync( 'sslcert/server.key', 'utf8' ) ; // openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout privateKey.key -out certificate.crt
	var certificate = fs.readFileSync( 'sslcert/server.crt', 'utf8' ) ;
	var credentials = { key: privateKey, cert: certificate } ;

	var app = express() ;                           // instantiate Express and assign our app variable to it

//	var config = require ( './config.js' ) ;        // read configuration file - not 1 but 3 !
	var configapp = require( './config/app' ) ;
	var configdb = require( './config/db' ) ;
	var configup = require( './config/usrpw' ) ;

// Get some values from configuration file

	app.set( 'Title', configapp.name ) ;
	app.set( 'iMaxReservesUsuari', configapp.iMaxReserves ) ; // we shall limit the number of pending reservations a user can have

                                                       // This is only place we specify the collection name(s) : 
	app.set( 'rcolname', configdb.col_reserves ) ;     // reservation collection name := "reserves_pistes" ;
	app.set( 'userscolname', configdb.col_usuaris ) ;  // users collection name       := "wCDT_users" ;
	var uszDB = configdb.url ;                         // ex 'localhost:27017/cdt' ; BBDD := "cdt" - *** unic lloc on s'escriu el nom de la base de dades ***
	var szDB = "" ;

// establish MONGO environment

	if ( process.env.VCAP_SERVICES ) {				// si estem a Bluemix
		try {
			szDB = JSON.parse( process.env.VCAP_SERVICES )['mongodb-2.4'][0].credentials.url ;  // mind URI if MONGOLAB @ UK + usuari intern
//			szDB = JSON.parse( process.env.VCAP_SERVICES )['mongolab'][0].credentials.uri ;    // mind URI if MONGOLAB @ US
//			szDB = JSON.parse( process.env.VCAP_SERVICES )['mongodb-2.4'][0].credentials.url ; // mind URL if MONGODB-2.4 @ UK
		}
		catch ( err ) {
		} ;
	} else { // (bmx-1)
		szDB = 'mongodb://' + uszDB ; // bluemix credentials already have the "mongodb://" prefix
	} ;


// display some initial info about our port and out mongo connection.

	myVersioLong = myVersio + ' - mongo ['+ szDB +'] ' ;
	
	var foo = process.env.wcdtFOO ;             // envir var to allow initial setup using /admin
	if ( typeof( foo ) !== 'undefined' ) {      // FOO environment variables exists -> doSomethingWith(foo);
		myVersioLong += ' - env {'+ foo +'}' ;
	} ; // 

// Some subroutines

// nova funció yyyyymmdd de Date() - at server
Date.prototype.yyyymmdd = function ( ) {                            
        var yyyy = this.getFullYear().toString();                                    
        var mm   = (this.getMonth()+1).toString(); // getMonth() is zero-based         
        var dd   = this.getDate().toString();
        return yyyy + '/' + (mm[1]?mm:"0"+mm[0]) + '/' + (dd[1]?dd:"0"+dd[0]);
}; // yyyymmdd()


// Write an initial message into console.
	app.set( 'appHostname', require('os').hostname() ) ;
	console.log( "+++ +++ +++ +++ +++ +++ +++ +++ APP wCDT starts. Versio[%s], HN[%s], TimeStamp[%s].", myVersio, app.get('appHostname'), (new Date).yyyymmdd() ) ;


	var db  = monk( szDB ) ;                        // 
	var szMongoDB = szDB ;                          // used at connect() - compte a Bluemix !
	var MongoClient = require( 'mongodb' ).MongoClient, format = require( 'util' ).format ;

// Connect to the db
	MongoClient.connect( szMongoDB, function( err, db ) {
		if ( ! err ) {
			console.log( "+++ We are connected to mongo." ) ;
		} ;
	} ) ; // connect to the db

// +++ app.configure( function () {

// The IP address of the Cloud Foundry DEA (Droplet Execution Agent) that hosts this application:
	var host = ( process.env.VCAP_APP_HOST || process.env.WCDTHOST || 'localhost' ) ;

// The port on the DEA for communication with the application:
	var port  = ( process.env.VCAP_APP_PORT || 80 ) ;                           // port used by HTTP
	var portS = ( process.env.VCAP_APP_PORT || process.env.WCDTPORT || 443 ) ;  // port used by HTTPS (bmx-2)


// Create "users" table/collection if not existent
	Create_Users_Collection () ;                     // create users collection/table if not existent, so we can always logon


// https://github.com/senchalabs/connect#middleware : list of officially supported middleware

	app.use( logger( "dev" ) ) ;                     // https://github.com/expressjs/morgan - tiny (minimal), dev (developer), common (apache)

	app.use( cookieParser( 'secretSebas' ) ) ;                                                  // pwd to encrypt all cookies - not required since vesion 1.5.0 : > https://www.npmjs.com/package/express-session
	app.use( session( { secret: 'secretSebas', resave: false, saveUninitialized: false } ) ) ;  // encrypt session contents, allow "req.session.*" header
	app.use( bodyParser.json() ) ;                                                              // parse application/json - do we need "application/x-www-form-urlencoded" ?


// use response object provided by express - http://expressjs.com/api.html#res.cookie

	var iCnt = 0 ;
	app.use( function( req, res, next ) { // own middleware, catching all messages

//		res.cookie( 'kukH0',        ++iCnt, { httpOnly: false } ) ;                 // https://github.com/expressjs/session
//		res.cookie( 'kukH1',        ++iCnt, { httpOnly: true } ) ;                  // chrome : HTTP "check"
//		res.cookie( 'kukSIG1',      ++iCnt, { signed: true } ) ;                    // http://stackoverflow.com/questions/11897965/what-are-signed-cookies-in-connect-expressjs
//		res.cookie( 'kukSIG1H1',    ++iCnt, { signed: true, httpOnly: true  } ) ;   // 
//		res.cookie( 'kukSIG1SEC1',  ++iCnt, { signed: true, secure: true } ) ;      // chrome : SECURE "check"

		res.cookie( 'kukTIT',       'MYTIT', { httpOnly: false, signed: false } ) ;                       // send some data to client(s), as page "title"
		res.cookie( 'kukVER',        myVersio, { httpOnly: false, signed: false } ) ;                     // send to client the server's version
		
		res.cookie( 'kukCON.SID',   'MYSID', { signed: true, httpOnly: true, secure: false } ) ;          // try to emulate connect.sid ?      si poso [maxAge: null] no surt ?

		res.cookie( 'kukHN',        app.get('appHostname'), { httpOnly: false, secure: true } ) ;         // send to client the server hostname

		res.cookie( 'kukDDC',       req.session.wcdt_diaconsultat, { httpOnly: false, signed: false } ) ; // send some data to client(s) - Data Darrera Consulta
		
		console.log( '### My Cookies are (%s) - [%s].', iCnt, JSON.stringify( { unsigned: req.cookies, signed: req.signedCookies } ) ) ;
// My Cookies are (50) - [{"unsigned":{"kuk-H0":"41","kuk-H1":"42"},"signed":{"kuk-SIG1":"43","kuk-SIG1-H1":"44","kuk-SIG1-SEC1":"45","connect.sid":"GC_O6S_X4X19o-f6sbTAQkSqdI0glcuQ"}}].
		next() ;
	} ) ; // trace own cookie


// serve static files and css
//   app.get( '/*', express.static( __dirname + '/public' ) ) ; // serve whatever is in the "public" folder at the URL "/:filename"

   var staticPath    =  __dirname + '/public' ;
   var staticOptions = { index: 'index.htm' } ;  // provide "index.htm" instead of the default "index.html"

   app.get( '/*', express.static( staticPath, staticOptions ) ) ;  // configure express options


// lets redirect the http traffic to https (bmx-3) 

var forcehttps = function () {
	
	console.log ( '### (1) force HTTPS.' ) ;
	
	return function ( req, res, next ) {

		console.log ( '>>> (2) force HTTPS.' ) ;
		console.log ( '>>> req.headers[x-forwarded-proto] = [%s].', req.headers['x-forwarded-proto'] ) ;
		console.log ( '>>> req.secure = [%s].', req.secure ) ;
		
//		console.dir( req.headers ) ;
//		console.dir( req ) ;

//		if ( ( ! req.secure ) || ( req.get ( 'x-forwarded-proto' ) != 'https' ) ) { // detect not a HTTPS - http://stackoverflow.com/questions/10183291/how-to-get-the-full-url-in-express-js

		if ( ! req.secure ) {

			if ( req.get ( 'x-forwarded-proto' ) != 'https' ) { 			
				console.log ( '+++ (3) force HTTPS.' ) ;
				return res.redirect ( 'https://' + req.headers.host + req.url ) ; // res.redirect requires "express" : http://expressjs.com/api.html#res.redirect
			} else {
				console.log ( '+++ (5) dont force HTTPS - has HTTPS (bluemix).' ) ;
				return next() ;
			} ;

		} else {
			console.log ( '+++ (4) dont force HTTPS - is SECURE (node).' ) ;
			return next() ;
		} ;
	} ;
} ; // forcehttps()


// abans de app.get() !
	
	app.use ( forcehttps() ) ; // redirect HTTP traffic onto a HTTPS protocol	


// Let write some subroutines
//	var funciones = require('./misfunciones.js');

// funcio per determinar si hi ha un soci logonejat
function hiHaSociEnSessio( ParamSessio ) {
	return ( typeof ParamSessio === 'object' && typeof ParamSessio.wcdt_nomsoci === 'string' ) ;
} ; // hiHaSociEnSessio()

// funcio per determinar si la data indicada esta 
//   en el futur - es poden fer reserves o esborrar-les
//     o
//   en el passat - no es permet fer reserves ni esborrar-les
function Fecha_En_El_Passat( Param_Dia ) {
	var Avui = (new Date).yyyymmdd() ;
	var ComEs = ( Param_Dia < Avui ) ;
	console.log( ">>> Mirem (%s) si el dia demanat {%s} es en el futur respecte de avui {%s}.", ComEs, Param_Dia, Avui ) ;
	return ( ComEs ) ;
//	return true ;
} ; // Fecha_En_El_Passat()

function Usuari_es_Administrador( ParamSessio ) {
	var bEsAdmin = false ;
	if ( ParamSessio.wcdt_tipussoci == "Administrator" ) {
		bEsAdmin = true ;
	} ;
	return bEsAdmin ;
} ; // Usuari_es_Administrador()


// Mira quantes reserves te un soci, de avui en endevant i en retorna un texte i un integer
function Get_Ocupacio ( Param_NomSoci, Param_Avui, CB ) {

	var CollectionName = app.get( 'rcolname' ) ;  // get collection name
   	var MyCollection = db.get( CollectionName ) ; // get the collection
	console.log( ">>> GET ocupacio - soci (%s) - veure fins a 20 reserves a partir del dia (%s) ", Param_NomSoci, Param_Avui ) ;
	
//	MyCollection.find ( { rnom: Param_NomSoci }, { limit: 20 }, function ( err, docs ) { 
	
	var Avui_getOcupacio = (new Date).yyyymmdd() ;
	MyCollection.find ( { rnom: Param_NomSoci,  rdata: { $gte: Avui_getOcupacio } }, { limit: 20 }, function ( err, docs ) { // http://docs.mongodb.org/manual/reference/operator/query/gte/

		szTxt = "" ;
		if ( err ) {
			console.log( '--- Get ocupacio. Error (%s) mongodb is (' + err.message + ').', err.errno ) ;
			szTxt +=  '<p>--- Get ocupacio. Error ('+ err.errno +') mongodb is (' + err.message + ').' ;
		} else {
			
			var  i = docs.length ;
			var iMaxReservesPendentsPerUsuari = app.get( 'iMaxReservesUsuari' ) ;  // get global constant
			console.log( "+++ Get ocupacio in collection (%s) for the date (%s) and user (%s) has (%s) elements.", CollectionName, Param_Avui, Param_NomSoci, i ) ;

			szTxt = "<p>Tens ["+ i +"] reserves vigents. El maxim es ("+ iMaxReservesPendentsPerUsuari +"). " ;
			if ( i > 0 ) {

				szTxt += "Son : " ;
				var idx = 0 ;
				while ( idx < i ) {
					var OcupacioPista = docs[idx].rpista ;
					var OcupacioData  = docs[idx].rdata ;
					var OcupacioHora  = docs[idx].rhora ;
					szTxt += "<p>["+ idx +"] - pista ["+ OcupacioPista +"], dia ["+ OcupacioData +"], hora ["+ OcupacioHora+"]. " ;
					idx ++ ;
				} ; // while
			} ; // if i > 0
		} ; // if Error

		CB ( err, i, szTxt ) ; // dintre de la funcio del find() !
		
	} ) ; // find()

} ; // Get_Ocupacio ( Param_NomSoci, Param_Avui ) 


// Lets set some routes for express() :
// =====================================

	var miMDW = require( './mimdwr.js' ) ; // own file with middleware

// (1) if customers asks for a "ping", we send actual date and the version of the code
miMDW.handlePing( app ) ;  // app.get( '/ping', function ( req, res ) { 

 
// (2) populate col (called from HELP page)
app.get( '/populate', function ( req, res ) {
    
	var CollectionName = app.get( 'rcolname' ) ;     // get "reservas" collection name
    var MyCollection = db.get( CollectionName ) ;    // get the collection
	console.log( ">>> {"+ req.session.wcdt_nomsoci +"} wants to POPULATE uCol (" + MyCollection.name + ")." ) ;

//    MyCollection.drop( function(e) {              // drop old database and wait completion

		var My_Initial_Reserves = [ // see wines.js
			{ rdata: "2015/05/09", rhora: "09", rpista: "3", rnom: "sebas" },
			{ rdata: "2015/05/10", rhora: "11", rpista: "4", rnom: "pere" },
			{ rdata: "2015/05/10", rhora: "13", rpista: "4", rnom: "enric" },
			{ rdata: "2015/05/10", rhora: "13", rpista: "5", rnom: "anton" }
		] ;

		var Avui = (new Date).yyyymmdd() ;
		My_Initial_Reserves[0].rdata = Avui ;
		My_Initial_Reserves[1].rdata = Avui ;
		My_Initial_Reserves[2].rdata = Avui ;
		My_Initial_Reserves[3].rdata = Avui ;
		
		MyCollection.insert ( My_Initial_Reserves, { safe:true }, function ( err, result ) {
	        if ( err ) { // send a HHTP error ? http://www.w3.org/Protocols/HTTP/HTRESP.html
				console.log( "--- Populate reservas. Error (%s) accessing COLLECTION (%s). Error is (%s).", err.errno, CollectionName, err.message ) ;
                res.status( 500 ).send( "--- populate : there was a problem adding the information to the database." ) ; // If it failed, return "internal error"
	        } else { 
                res.status( 200 ).send( "+++ {"+ req.session.wcdt_nomsoci +"} COL [" + MyCollection.name + "] populated OK." ) ; // else, indicate OK.
	        } ; // else
		} ) ; // insert

	//	} ) ; // drop
	
} ) ; // get '/populate'


// (3) dump all reserves (called from HELP page)
app.get( '/dump_all_reserves', function ( req, res ) {
	
	console.log( ">>> GET ALL reserves : veure fins a 20 reserves de tots els dies." ) ;
	var CollectionName = app.get( 'rcolname' ) ;     // get "reservas" collection name
    var MyCollection = db.get( CollectionName ) ;    // get the collection

	MyCollection.find ( {  }, { limit: 20 }, function ( err, docs ) { // empty filter

		if ( err ) { 
            console.log( "--- Dump all reservas. Error (%s) accessing COLLECTION (%s). Error is (%s).", err.errno, CollectionName, err.message ) ;
            res.status( 500 ).send( {'error':'dump all reserves DDBB error.'} ) ; // internal error
        } else {
            var  i = docs.length ;
            console.log( "+++ the collection (%s) for all dates has (%s) elements.", CollectionName, i ) ;
            res.json( docs ) ; // send JSON object
		} ;
	}) ; // find()

} ) ; // get '/dump_all_reserves'


// (4) mostrar les reserves que hi ha per un dia donat
// start with a msg as "GET /qui_te_reserves/data_Reserva=2014/12/06"
// "data_Reserva" surt del "name" del input field en el "form"
app.get( '/qui_te_reserves/data_Reserva=:dia_consultat', function ( req, res ) {
	
    var DiaConsultat = req.params.dia_consultat ; // if BLANK then 404 ;
	var CollectionName = app.get( 'rcolname' ) ;  // get collection name
   	var MyCollection = db.get( CollectionName ) ; // get the collection
	
	req.session.wcdt_diaconsultat = DiaConsultat ;  // save "data darrera consulta" in session [sess]
	
	console.log( ">>> (%s) GET veure reserves 1 dia - collection (%s) - veure fins a 20 reserves del dia (%s) ", req.session.wcdt_nomsoci, CollectionName, DiaConsultat ) ;
	
	MyCollection.find ( { rdata: DiaConsultat }, { limit: 20 }, function ( err, docs ) { 

		if ( err ) {
			console.log( '--- Veure reserves. Error (%s) mongodb is (' + err.message + ').', err.errno ) ;
			res.status( 500 ).send( {'error':'mongodb error has occurred'} ) ; // internal error
		} else {	
			var  i = docs.length ;
			console.log( "+++ (%s) - the collection (%s) for the date (%s) has (%s) elements.", req.session.wcdt_nomsoci, CollectionName, DiaConsultat, i ) ;
			res.json( docs ) ; // send JSON object
		} ; // if Error

	}) ; // find()

} ) ; // get '/qui_te_reserves/data_Reserva=:dia_consultat'


// (5) fer una reserva nova
// start with a msg as "POST /fer_una_reserva/Nom_Soci=nil&Pista_Reserva=0&Dia_Reserva=2000%2F01%2F01&Hora_Reserva=00"
app.post( '/fer_una_reserva/Nom_Soci=:res_nom_soci&Pista_Reserva=:res_pista&Dia_Reserva=:res_dia&Hora_Reserva=:res_hora', function ( req, res ) {

	var Reserva_NomSoci = req.params.res_nom_soci ;
	var Reserva_Pista   = req.params.res_pista ;
	var Reserva_Dia     = req.params.res_dia ;
//	if ( Reserva_Dia < 10 ) { Reserva_Dia = '0' + Reserva_Dia } ;
	var Reserva_Hora    = req.params.res_hora ;
//	if ( Reserva_Hora < 10 ) { Reserva_Hora = '0' + Reserva_Hora } ;

	if ( hiHaSociEnSessio( req.session ) )
	{
		console.log( ">>> ["+ req.session.wcdt_nomsoci +"] POST fer una nova reserva. Nom (%s), pista (%s), dia (%s), hora (%s).", Reserva_NomSoci, Reserva_Pista, Reserva_Dia, Reserva_Hora ) ;
		
		var CollectionName = app.get( 'rcolname' ) ;  // get collection name
		var MyCollection = db.get( CollectionName ) ; // get the collection
		
		var MyReserva = { rnom: "", rpista: "", rdata: "", rhora: "" } ;  // new object with empty fields
		MyReserva.rnom   = Reserva_NomSoci ;
		MyReserva.rpista = Reserva_Pista ;
		MyReserva.rdata  = Reserva_Dia ;
		MyReserva.rhora  = Reserva_Hora ;

		var Avui = (new Date).yyyymmdd() ;

		// mirem que el usuari pugui fer reserves, es a dir, que no n'hagi arribat al maxim - podem dir que te tokens/slots lliures

		console.log( '*** cridem GETOCUPACIO reserva(). HN server (%s).', req.session.wcdt_hostname ) ;
		Get_Ocupacio ( MyReserva.rnom, Avui, function ( err, iOcupacio, szOcupacio ) {

			var iMaxReservesPendentsPerUsuari = app.get( 'iMaxReservesUsuari' ) ;  // get global constant
			console.log( '*** acaba GETOCUPACIO reserva() - reserves pend/max (%s/%s).', iOcupacio, iMaxReservesPendentsPerUsuari ) ;

			if ( err ) {
				console.log( '--- get_ocupacio reserva() trouble. Error (%s) means (%s).', err.errno, err.message  ) ;
				res.status( 500 ).send( '--- internal error at get_ocupacio reserva().' ) ;
			} else {

				if ( iOcupacio >= iMaxReservesPendentsPerUsuari ) {
					var szMsg_reserva = '--- Error : no pots fer noves reserves, car tens per disfrutar [' + iOcupacio + '] reserves anteriors i el maxim es ('+iMaxReservesPendentsPerUsuari+'). ' ;
					res.status( 200 ).send( szMsg_reserva ) ; // deprecated code : res.send( 200, szMsg_Logon_OK ) ;
				} else { // we can proceed : user has spare tokens

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
					if ( Fecha_En_El_Passat( Reserva_Dia ) ) {
						szErrorString = "La data requerida {" + Reserva_Dia + "} es en el passat. No es poden fer reserves en el passat." ;
						iTotOK = 0 ;  // indicate error in parameters
					} ;
					
					if ( iTotOK == 1 ) {  // parameters ok
					
						// mirem si aquesta pista ja esta ocupada aquest dia i hora :

						MyCollection.find ( { rdata: Reserva_Dia, rhora: Reserva_Hora, rpista: Reserva_Pista }, { limit: 20 }, function ( err, docs ) { 

							if ( err ) { 
								console.log( "--- Fer Reserva. Error (%s) accessing COLLECTION (%s). Error is (%s).", err.errno, CollectionName, err.message ) ;
								res.status( 500 ).send( {'error': 'fer reserva DDBB error.'} ) ; // internal error
							} else {
						
								var  i = docs.length ;
								console.log( "+++ the slot for that moment has (%s) elements.", i ) ;

								if ( i < 1 ) { // si no esta ocupat, la reservem
						
									console.log( 'Afegim una reserva : ' + JSON.stringify( MyReserva ) ) ;
								
									MyCollection.insert ( MyReserva, { safe:true }, function ( err, result ) {
										if ( err ) {
											console.log( '---- Could not insert reservation into MongoDB. Error (%s) meaning (%s).', err.errno, err.message ) ;
											res.status( 500 ).send( {'error':'An error has occurred'} ) ; // internal error
										} else {
											console.log( '++++ Success: insert went ok.' ) ;
											res.status( 200 ).send( "+++ fer reserva OK. User("+ Reserva_NomSoci +"), pista("+ Reserva_Pista +"), dia("+ Reserva_Dia +"), hora("+ Reserva_Hora +")." ) ; // else, indicate OK.
										} ; // if Error
									} ) ; // insert
							
								} else { // else, tell customer the slot is not free

									var QuiEs = '' ;
									if ( i == 1 ) {
										QuiEs = docs[0].rnom ;
									} ;
									szResultat = "--- Error Reserva - ("+i+") slot Pista("+ Reserva_Pista +") Dia("+ Reserva_Dia +") Hora("+ Reserva_Hora +") ocupat per en (" + QuiEs + ")." ;
									console.log( szResultat ) ;
									res.status( 200 ).send( szResultat ) ; // else, indicate no OK - OK as HTTP rc, but
							
								} ;  // if did exist
							} ; // error in find()
						}) ; // find()

					} else {  // error en algun parametre
						szResultat = "--- Parametre incorrecte : (" + szErrorString + ")." ;
						console.log( szResultat ) ;
						res.status( 200 ).send( szResultat ) ; // else, indicate no OK.
					} ; // iTotOK

				} ; // user has free tokens
			} ; // error dins get ocupacio reserva()
		} ) ; // own async function : get_ocupacio (uses mongo)

	} else {
		szResultat = "--- WCDT0004 - CANT do a new reserva - soci ["+ req.session.wcdt_nomsoci +"] not logged in." ;
		console.log( szResultat ) ;
		res.status( 200 ).send( szResultat ) ; // 404 does not display attached text
	} ; // not logged in - cant do new reserva

} ) ; // get '/fer_una_reserva/<parametres>'


// (6) esborrar una reserva 
// start with a msg as "POST /esborrar_una_reserva/Nom_Soci_Esborrar=Ivan&Pista_Reserva_Esborrar=3&Dia_Reserva_Esborrar=2015%2F02%2F19&Hora_Reserva_Esborrar=10"
// Podem esborrar una reserva si :
//    *) som el seu propietari (o som el Administrador)
//    *) la data es "futura", es a dir, que no s'ha jugat (o som el Administrador)
app.post( '/esborrar_una_reserva/Nom_Soci_Esborrar=:res_nom_soci&Pista_Reserva_Esborrar=:res_pista&Dia_Reserva_Esborrar=:res_dia&Hora_Reserva_Esborrar=:res_hora', function ( req, res ) {
	
	var Esborra_Reserva_NomSoci = req.params.res_nom_soci ;
	var Esborra_Reserva_Pista   = req.params.res_pista ;
	var Esborra_Reserva_Dia     = req.params.res_dia ;
	var Esborra_Reserva_Hora    = req.params.res_hora ;
	var szResultat = "" ;
	
	if ( hiHaSociEnSessio( req.session ) )
	{

		if ( ( Fecha_En_El_Passat( Esborra_Reserva_Dia ) ) && ( Usuari_es_Administrador( req.session ) == false ) ) { // funciones.Usuari_Administrador() == false 
			
			szResultat = "--- La data requerida {" + Esborra_Reserva_Dia + "} es en el passat. No es poden esborrar reserves del passat." ;
			console.log( szResultat ) ;
			res.status( 200 ).send( szResultat ) ; // OK

		} else {

			console.log( ">>> ["+ req.session.wcdt_nomsoci +"] POST esborrar una reserva. Nom (%s), pista (%s), dia (%s), hora (%s).", Esborra_Reserva_NomSoci, Esborra_Reserva_Pista, Esborra_Reserva_Dia, Esborra_Reserva_Hora ) ;

			var CollectionName = app.get( 'rcolname' ) ;  // get collection name
			var MyCollection = db.get( CollectionName ) ; // get the collection
			
			var MyEsborraReserva = { rnom: "", rpista: "", rdata: "", rhora: "" } ;  // new object with empty fields
			MyEsborraReserva.rnom   = Esborra_Reserva_NomSoci ;
			MyEsborraReserva.rpista = Esborra_Reserva_Pista ;
			MyEsborraReserva.rdata  = Esborra_Reserva_Dia ;
			MyEsborraReserva.rhora  = Esborra_Reserva_Hora ;

			MyCollection.find ( { rdata: Esborra_Reserva_Dia, rhora: Esborra_Reserva_Hora, rpista: Esborra_Reserva_Pista }, { limit: 20 }, function ( err, docs ) { 

				if ( err ) { 
					szResultat = "--- Esborrar Reserva. Error ("+err.errno+") accessing COLLECTION ("+CollectionName+"). Error is ("+err.message+")." ;
					console.log( szResultat ) ;
					res.status( 500 ).send( { 'error': szResultat } ) ; // internal error
				} else {
			
					var  i = docs.length ;
					console.log( "+++ Remove reserva - the slot for that moment has (%s) elements.", i ) ;

					if ( i < 1 ) { // si no esta ocupat, es un error
				
							szResultat = '--- Error esborrant reserva - ('+ i +') slot lliure o no es teu. Nom ('+ Esborra_Reserva_NomSoci +'), pista ('+ Esborra_Reserva_Pista +'), dia ('+ Esborra_Reserva_Dia +'), hora ('+ Esborra_Reserva_Hora +').' ;
							console.log( szResultat ) ;
							res.status( 200 ).send( szResultat ) ; // else, indicate no OK - OK as HTTP rc, but

					} else { // else, the slot is not free so we can (try to) remove it
				
						var ObjectIdPerEsborrar = docs[0]._id ;
						var UsuariPerEsborrar   = docs[0].rnom ;

						if ( ( Esborra_Reserva_NomSoci != UsuariPerEsborrar ) && ( Usuari_es_Administrador( req.session ) == false ) ) {
							szResultat = "--- WCDT0005 - tu {" + Esborra_Reserva_NomSoci + '/' + req.session.wcdt_nomsoci + '/' + req.session.wcdt_tipussoci + "} no pots esborrar una reserva d'en (" + UsuariPerEsborrar + ")." ;
							console.log( szResultat ) ;
							res.status( 200 ).send( szResultat ) ; // OK
						} else {

							console.log( '>>> Esborrem la reserva de ID [' + ObjectIdPerEsborrar + '].' ) ;
							MyCollection.remove ( {"_id": ObjectIdPerEsborrar }, { safe:true }, function ( err, result ) {
								if ( err ) {
									szResultat =  '--- Could not remove reservation from MongoDB. Error ('+err.errno+') is ('+err.message+').' ;
									console.log( szResultat ) ;
									res.status( 500 ).send( { 'error': szResultat } ) ; // internal error
								} else {
									szResultat = "+++ esborrar reserva OK. User("+ UsuariPerEsborrar +"), pista("+ Esborra_Reserva_Pista +"), dia("+ Esborra_Reserva_Dia +"), hora("+ Esborra_Reserva_Hora +")." ;
									console.log( szResultat ) ;
									res.status( 200 ).send( szResultat ) ; // else, indicate OK.
								} ; // if Error

							} ) ; // remove

						} ; // owner of the cell
						
					} ;  // if did exist
				} ; // if error in find()

			}) ; // find()
		
		} ; // la data requerida no es en el passat
		
	} else {
		szResultat = '--- WCDT0003 - Error Reserva - cant delete old reserva if not logged - soci ['+ req.session.wcdt_nomsoci +'] not logged in.' ;
		console.log( szResultat ) ;
		res.status( 200 ).send( szResultat ) ; // 404 does not display attached text
	} ; // not logged in - cant delete old reserva

} ) ; // get '/esborrar_una_reserva/<parametres>'


// (7) fer logon() de un usuari
// rebem GET /logonuser/nom_Logon=Ivan&pwd_Logon=Grozniy
app.get( '/logonuser/nom_Logon=:log_nom_soci&pwd_Logon=:log_pwd', function ( req, res ) {

	var Logon_NomSoci = req.params.log_nom_soci ; // instead of req.query.log_nom_soci
	var Logon_PwdUser = req.params.log_pwd ;

	var Avui = (new Date).yyyymmdd() ;
	console.log( ">>> GET LOGON(). Data (%s). Nom (%s), pwd (%s). HN client (%s).", Avui, Logon_NomSoci, Logon_PwdUser, req.headers.host ) ;
	res.cookie( 'kukHNCLI', req.headers.host, { httpOnly: false, secure: true } ) ;
	
	var CollectionName = app.get( 'userscolname' ) ;     // get collection name
	var MyUsersCollection = db.get( CollectionName ) ;   // get the collection
	console.log( ">>> Using USERS table/collection (" + MyUsersCollection.name + ")." ) ;

	MyUsersCollection.find( { uAlias: Logon_NomSoci }, { limit: 20 }, function ( err, docs ) { 
	
		if ( err ) {
			console.log( '--- Logon MongoDB error. Error (%s) is (%s)', err.errno, err.message ) ;
			res.status( 500 ).send( {'error':'mongodb error has occurred'} ) ; // internal error
		} else { // no ERR

			var  i = docs.length ;
			console.log( "+++ the collection (%s) for the user (%s) has (%s) elements.", CollectionName, Logon_NomSoci, i ) ;
		
			if ( docs ) {
				if ( i > 0 ) {
					console.log( '+++ user (%s) found. Lets see its PWD.', Logon_NomSoci ) ;
					var ObjectId_User_at_bbdd = docs[0]._id ;
					var Logon_Pwd_From_bbdd   = docs[0].uPwd ;
					console.log( '+++ PWD - bbdd [' + Logon_Pwd_From_bbdd + '], user [' + Logon_PwdUser + '].' ) ;
					
					if ( Logon_PwdUser == Logon_Pwd_From_bbdd ) {
						
						req.session.wcdt_nomsoci   = Logon_NomSoci ; 	        // guardar nom soci en la sessio      [sess]
						req.session.wcdt_tipussoci = docs[0].uRole ;            // guardar tipus de soci en la sessio [sess]

						var mSg = new Date() ;                                  // as "Fri Mar 13 2015 21:30:27 GMT+0100 (Romance Standard Time)"
						req.session.wcdt_lastlogon = mSg.toISOString() ;        // 
						req.session.wcdt_instant_inicial = Date.now() ;         //

//						var szHostName = require('os').hostname() ;             // server hostname. client is in req.headers.host
//						req.session.wcdt_hostname = szHostName ;
//						res.cookie( 'kukHN', szHostName, { httpOnly: false, secure: true } ) ; // "httpOnly: false" -> can be seen by browser code ; "secure: true" is a recommended option

						console.log( '*** cridem GETOCUPACIO logon(). HN server (%s).', req.session.wcdt_hostname ) ;
						Get_Ocupacio ( Logon_NomSoci, Avui, function ( err, iOcupacio, szOcupacio ) {

							var iMaxReservesPendentsPerUsuari = app.get( 'iMaxReservesUsuari' ) ;  // get global constant
							console.log( '*** acaba GETOCUPACIO logon() - reserves pend/max (%s/%s).', iOcupacio, iMaxReservesPendentsPerUsuari ) ;

							if ( err ) {
								console.log( '--- get_ocupacio logon() trouble. Error (%s) means (%s).', err.errno, err.message  ) ;
								res.status( 500 ).send( '--- internal error at get_ocupacio logon().' ) ;
							} else {

								var szMsg_Logon_OK = '+++ WCDT0001 - logon and PWD OK. ' ;
								szMsg_Logon_OK += '<p>Welcome back, (' + Logon_NomSoci + '). ' ;
								if ( req.session.wcdt_tipussoci == "Administrator" ) {
									szMsg_Logon_OK += "Tens poders de'administrador. " ;	// mind this text is used in CLIENT.JS to determine if user is of type Admin or not.
																							// shall we set a cookie ?
								} ;

								szMsg_Logon_OK += '<p>El teu correu electronic es {' + docs[0].uEmail + '}. ' ;

								if ( iOcupacio >= iMaxReservesPendentsPerUsuari ) {
									szMsg_Logon_OK += '<p>*** Compte : no pots fer noves reserves, car tens per disfrutar [' + iOcupacio + '] reserves anteriors i el maxim es ('+iMaxReservesPendentsPerUsuari+'). ' ;
								} ;
								szMsg_Logon_OK += szOcupacio ; // mostrar reserves anteriors
								szMsg_Logon_OK += '<hr><p> &nbsp;<div class="txtblanc"><center><h3>Que fem ara ?</h3><p>Ara podries consultar la ocupacio de les pistes.</center></div><p> &nbsp;<hr>' ;
								res.status( 200 ).send( szMsg_Logon_OK ) ; // deprecated code : res.send( 200, szMsg_Logon_OK ) ;
							} ; // error dins get ocupacio logon()
						} ) ; // own async function : get_ocupacio (uses mongo)
						
					} else {
						console.log( '--- PWD not right.' ) ;
						res.status( 401 ).send( 'user ('+ Logon_NomSoci + ') incorrect password ('+Logon_PwdUser+').' ) ;
					} ; // both passwords are the same ?

				} else {
					console.log( '--- USER ('+ Logon_NomSoci +') NOT FOUND.' ) ;
					res.status( 401 ).send( 'user ('+ Logon_NomSoci + ') not found.' ) ;
				} ;
			} else {
				console.log( '--- no DOCS returned.' ) ;
				res.status( 404 ).send( "--- no DOCS." ) ; 
			} ; // if Docs
		} ; // if Error

	}) ; // find()
	
} ) ; // get '/logonuser/nom_Logon=:log_nom_soci&pwd_logon=:log_pwd'


// (8) logoff de un usuari
// rebem POST /logoff_user
app.post( '/logoff_user', function ( req, res ) {
	
	var Avui = (new Date).yyyymmdd() ;
	console.log( ">>> POST LOGOFF(). Data (%s), user (%s).", Avui, req.session.wcdt_nomsoci ) ;

	if ( req.session.wcdt_nomsoci ) {
		
		console.log( '*** cridem GETOCUPACIO logoff().' ) ;
		Get_Ocupacio ( req.session.wcdt_nomsoci, Avui, function ( err, iOcupacio, szOcupacio ) {

			var iMaxReservesPendentsPerUsuari = app.get( 'iMaxReservesUsuari' ) ;  // get global constant
			console.log( '*** acaba GETOCUPACIO logoff() - reserves pend/max (%s/%s).', iOcupacio, iMaxReservesPendentsPerUsuari ) ;

			if ( err ) {
				console.log( '--- get_ocupacio logoff() trouble. Error (%s) means (%s).', err.errno, err.message ) ;
				res.status( 500 ).send( '--- internal error at get_ocupacio logoff().' ) ;
			} else {

// compte : 
//   primer modifiquem REQ.SESSION
//   despres enviem RES.STATUS
// no pas al inreves !!!

				console.log( '??? Try to remove user in logoff ('+ req.session.wcdt_nomsoci +'), before' ) ;
				var szSociLogoff = req.session.wcdt_nomsoci ;
				req.session.wcdt_nomsoci = '' ;
				delete req.session.wcdt_nomsoci ;   // remove session field when async function ends - see [sess]
				delete req.session.wcdt_tipussoci ; // remove session field when async function ends - see [sess]
				console.log( '??? Try to remove user in logoff ('+ req.session.wcdt_nomsoci +'), after' ) ;
				
				var iPeriode = Date.now() ;
				console.log( 'logoff.now is ('+ iPeriode +')' ) ;
				console.log( 'logoff.old is ('+ req.session.wcdt_instant_inicial +')' ) ;
				iPeriode = iPeriode - req.session.wcdt_instant_inicial ;
				var szMsg_Logoff_OK = "+++ WCDT0002 - logoff user {"+ szSociLogoff + "}, logged on at {"+ req.session.wcdt_lastlogon +"}, duracio ["+ iPeriode +"] msg. "
				szMsg_Logoff_OK += szOcupacio ;								
				res.status( 200 ).send( szMsg_Logoff_OK ) ;
			} ; // error dins get ocupacio logoff()
		} ) ; // own async function : get_ocupacio (uses mongo)

	} else {
		res.status( 200 ).send( "You have to do Logon() before Logoff() !" ) ;
	} ;
	
} ) ; // post '/logoff_user'


// (9) dump all users (called from HELP page)
app.get( '/dump_all_users', function ( req, res ) {
	
	var CollectionName = app.get( 'userscolname' ) ;   // get "users" collection name
	console.log( ">>> GET ALL users collection (%s) : veure fins a 20 usuaris de tots els dies.", CollectionName ) ;

// (a) if collection does not exists, create it
	
	MongoClient.connect( szMongoDB, function( err, db ) {

		if ( err ) { 
			console.log( "--- Dump all users. Error (%s) accessing COLLECTION (%s). Error is (%s).", err.errno, CollectionName, err.message ) ;
		} else {

			db.collection( CollectionName, { strict:true }, function( err, collection ) { // Notice the {strict:true} option. This option will make the driver check if the collection exists and issue an error if it does not.
			
				if ( err ) {
					console.log( "--- Dump all users, connection(). Error accessing COLLECTION (%s). Error (%s) is (%s).", CollectionName, err.errno, err.message ) ;
				} else {
					console.log( "+++ Dump all users, connection COL (%s).", CollectionName ) ;
				} ;
			} ) ; // http://mongodb.github.io/node-mongodb-native/api-articles/nodekoarticle1.html

		} ; // connect() error
	} ) ; // connect()

// (b) list all its users
	
    var MyCollection = db.get( CollectionName ) ;      // get the collection

	MyCollection.find ( {  }, { limit: 20 }, function ( err, docs ) { // empty filter
	
	    if ( err ) { 
            console.log( "--- Dump all users, find(). Error accessing COLLECTION (%s). Error (%s) is (%s).", CollectionName, err.errno, err.message ) ;
            res.status( 500 ).send( {'error':'dump all users DDBB error.'} ) ; // internal error
        } else {
            var  i = docs.length ;
            console.log( "+++ the collection (%s) for all dates has (%s) elements.", CollectionName, i ) ;
            res.json( docs ) ; // send JSON object
		} ;
	}) ; // find()

} ) ; // get '/dump_all_users'


// (10) users database admin - called from HELP.HTM
app.get( '/admin', function ( req, res ) {

	console.log( ">>> admin pages, only for admin users." ) ;

	var szMsg_Admin_Rsp = '' ;

	if ( hiHaSociEnSessio( req.session ) ) {
		console.log( "+++ (admin) hi ha soci, tipus (%s).", req.session.wcdt_tipussoci ) ;
		szMsg_Admin_Rsp = 'Tenim soci' ;
		res.status( 200 ).send( szMsg_Admin_Rsp ) ;
	} else {
		console.log( "--- (admin) no hi ha soci - tinc (%s/%s).", foo, hiHaSociEnSessio( req.session ) ) ;
		szMsg_Admin_Rsp = 'No hi ha soci' ;
		res.status( 401 ).send( szMsg_Admin_Rsp ) ;
	} ;
} ) ; // get '/admin'


// (11) /delete_bbdd_users - called from ADMIN.HTM
app.get( '/delete_col_users', function ( req, res ) {

	console.log( ">>> admin menu, delete taula usuaris." ) ;

	var CollectionName = app.get( 'userscolname' ) ; // get "users" collection name
	var MyCollection = db.get( CollectionName ) ;    // get the collection
	console.log( ">>> {"+ req.session.wcdt_nomsoci +"} wants to DELETE collection (" + MyCollection.name + ")." ) ;

	MyCollection.drop( function( err ) {             // drop old collection and wait completion
	
		if ( err ) {
			console.log( "--- Delete users table/collection. Error accessing COLLECTION (%s). Error (%s) is (%s).", CollectionName, err.errno, err.message ) ;
			res.status( 500 ).send( {'error':'delete users collection error ['+ err.message +']'} ) ;
		} else {
			console.log( '+++ Delete users table/collection went ok.' ) ;
			res.status( 200 ).send( "+++ delete users collection went OK." ) ; 
		} ; // if error
	} ) ; // drop()

} ) ; // get '/delete_bbdd_users'


// (12) /list_collections - called from INDEX.HTM
app.get( '/list_collections', function ( req, res ) {

	console.log( '>>> Llistar les taules conegudes.' ) ;
	console.log( '>>> >>> (a) connect to DB (%s).', szMongoDB ) ; // mongodb://user:pass@host:port/dbname
	
	MongoClient.connect( szMongoDB, function( err, db ) {

		if ( err ) { 
			console.log( "--- Dump all users. Error (%s) accessing COLLECTION (%s). Error is (%s).", err.errno, CollectionName, err.message ) ;
		} else {

			console.log( '+++ (a) connected to (%s).', szMongoDB ) ;

			var adminDB = db.admin() ;
			var szLst = '' ;

			adminDB.listDatabases( function( err, dbs ) {
	
				if ( err ) {
					console.log( "--- List DDBB error - num (%s) meaning (%s).", err.errno, err.message ) ;
				} else {
					var  i = dbs.databases.length ;
					console.log( ">>> >>> (b) List databases. Mongo has (%s) databases.", i ) ;
					
					var j = 0 ;
					while ( j < i ) {
						szLst += "<p>["+ j +"] - ddbb ["+ dbs.databases[j].name +"], size ["+ dbs.databases[j].sizeOnDisk +"]. " ;
						j ++ ;
					} ;
					console.log( szLst ) ;
					res.status( 200 ).send( szLst ) ; 
				} ; // error
				db.close() ;
			} ) ; // listDatabases
		
		} ; // connect() error

	} ) ; // connect

} ) ; // get '/list_collections'


// (13) /create_users_col - called from INDEX.HTM
// app.get( '/create_users_col', function ( req, res ) {
function Create_Users_Collection () {
	
	var CollectionName = app.get( 'userscolname' ) ;  // get "users" collection name	
	var MyCollection = db.get( CollectionName ) ;     // get the collection

	console.log( '+++ crear coleccio/taula de usuaris.' ) ;
	console.log( '+++ (a) connect to DB (%s).', szMongoDB ) ;

	MongoClient.connect( szMongoDB, function( err, db ) {

		if ( err ) {
			console.log( "--- create uCol.connect() database URI (" + szMongoDB + ") error. Error is (%s).", err.message ) ;
		} else {

			console.log( '+++ (b) create collection (%s).', CollectionName ) ;
			
			db.createCollection( CollectionName, {strict:true}, function( err, collection ) { // create the collection on the Mongo DB database before returning the collection object. If the collection already exists it will ignore the creation of the collection.

				if ( err ) {
					console.log( '--- Error creating collection ('+ CollectionName +'). Error ('+ err.errno +') is ('+ err.message +').' ) ;
				} else {
					console.log( '+++ Collection ' + CollectionName + ' created.' ) ; // but empty

					var My_User_To_Add_pere = 
					{ 	
						uAlias        : "pere", 
						uPwd          : "pere2015",             // use ENV.wcdtFOO ?
						uRole         : "Administrator",
						uNom          : "Pere Albert Labal",
						uEmail        : "palbcn@yahoo.com",
						uLastLogin    : "2015/01/01",
						uMisc         : "-" 
					} ;

					MyCollection.insert( My_User_To_Add_pere, { safe:true }, function( err, result ) {
						if ( err ) { 
							console.log( "--- create usr1Col (" + MyCollection.name + ") error. Error is (%s).", err.message ) ;
						} else { 
							console.log( "+++ create usr1Col (" + MyCollection.name + ") OK, user (%s).", My_User_To_Add_pere.uAlias ) ;
						} ; // else
					} ) ; // insert
				} ; // error create collection
			} ) ; // createCollection
		} ; // connect() error
	} ) ; // connect
	
} ; // '/create_users_collection'


// (14) GET /fer_alta_usuari/nom_Alta=joan&pwd_Alta=perepocapor&tipus_Alta=Guest
app.get( '/fer_alta_usuari/Alta_User_Nom=:NewUserName&Alta_User_Pwd=:NewUserPwd&Alta_User_Email=:NewUserEmail&Alta_User_Type=:NewUserType', function ( req, res ) {

	var Alta_UserName  = req.params.NewUserName ;
	var Alta_UserPwd   = req.params.NewUserPwd ;
	var Alta_UserEmail = req.params.NewUserEmail ;
	var Alta_UserType  = req.params.NewUserType ;
	
	var szResultat = "" ;
	var Avui = (new Date).yyyymmdd() ;
	console.log( ">>> GET una ALTA() de usuari. Data (%s). Nom (%s), pwd (%s), email(%s), type(%s).", Avui, Alta_UserName, Alta_UserPwd, Alta_UserEmail, Alta_UserType ) ;

	var CollectionName = app.get( 'userscolname' ) ;     // get collection name
	var MyUsersCollection = db.get( CollectionName ) ;   // get the collection
	console.log( ">>> Using USERS table/collection (" + MyUsersCollection.name + ")." ) ;

	MyUsersCollection.find( { uAlias: Alta_UserName }, { limit: 20 }, function ( err, docs ) { 

		if ( err ) {
			szResultat = '--- AltaUser MongoDB error. Error ('+err.errno+') is ('+err.message+')' ;
			console.log( szResultat ) ;
			res.status( 500 ).send( { 'error': szResultat } ) ; // internal error
		} else { // no ERR

			var  i = docs.length ;
			console.log( "+++ AltaUser, the collection (%s) for the user (%s) has (%s) elements.", CollectionName, Alta_UserName, i ) ;
		
			if ( docs ) {
				
				if ( i > 0 ) {
					szResultat = '--- user ('+ Alta_UserName + ') already exists.' ;
					console.log( szResultat ) ;
					res.status( 200 ).send( szResultat ) ;
				} else { // user does not exist so we can create it

					var My_User_To_Add = 
					{ 	
						uAlias        : "uA", 
						uPwd          : "uP",             // use ENV.wcdtFOO ?
						uRole         : "Guest",
						uNom          : "uN",
						uEmail        : "uE",
						uLastLogin    : "-",
						uMisc         : "-" 
					} ;

					My_User_To_Add.uAlias = Alta_UserName ;
					My_User_To_Add.uPwd   = Alta_UserPwd ;
					My_User_To_Add.uEmail = Alta_UserEmail ;
					My_User_To_Add.uRole  = Alta_UserType ;
					
					var szMsg_Alta = "" ;
					MyUsersCollection.insert( My_User_To_Add, { safe:true }, function( err, result ) {
						
						if ( err ) { 
							szMsg_Alta = "<p> --- create user at collection (" + MyUsersCollection.name + ") error. Error is (+ err.message +)." ;
							console.log( "--- Create User" ) ;
						} else { 
							szMsg_Alta = "<p> +++ create user at collection (" + MyUsersCollection.name + ") OK, user ("+ My_User_To_Add.uAlias +")." ;
							console.log( "+++ Create User" ) ;
						} ; // else

					res.status( 200 ).send( szMsg_Alta ) ; 
//					res.send( 200, szMsg_Alta ) ;
//	res.writeHead( 200, { 'Content-Type': 'text/html' } ) ; 
//	res.write( texte ) ;
//	res.end( ) ;

					} ) ; // insert
				} ; // if user does not exist

			} else {
				szResultat = '--- Alta user error - no DOCS returned.' ;
				console.log( szResultat ) ;
				res.status( 404 ).send( szResultat ) ; 
			} ; // if Docs
		} ; // if Error
	}) ; // find()

} ) ; // get /fer_alta_usuari


// (15) GET /fer_baixa_usuari/nom_Baixa=anton
app.get( '/fer_baixa_usuari/nom_Baixa=:OldUserName', function ( req, res ) {

	var Baixa_UserName  = req.params.OldUserName ;
	var Avui = (new Date).yyyymmdd() ;
	console.log( ">>> GET una BAIXA() de usuari. Data (%s). Nom (%s).", Avui, Baixa_UserName ) ;
	var szResultat = "" ;
	
	if ( hiHaSociEnSessio( req.session ) )
	{
		if ( Usuari_es_Administrador( req.session ) == true ) { 
		
			var CollectionName = app.get( 'userscolname' ) ;     // get collection name
			var MyUsersCollection = db.get( CollectionName ) ;   // get the collection
			console.log( ">>> Using USERS table/collection (" + MyUsersCollection.name + ")." ) ;
			
			MyUsersCollection.find( { uAlias: Baixa_UserName }, { limit: 20 }, function ( err, docs ) { 
				if ( err ) { 
					szResultat = "--- Esborrar baixa usuari. Error ("+err.errno+") accessing COLLECTION ("+CollectionName+"). Error is ("+err.message+")." ;
					console.log( szResultat ) ;
					res.status( 500 ).send( { 'error': szResultat } ) ; // internal error
				} else {
					
					var  i = docs.length ;
					console.log( "+++ BaixaUser, the collection (%s) for the user (%s) has (%s) elements.", CollectionName, Baixa_UserName, i ) ;
					if ( docs ) {
						
						if ( i > 0 ) {

							var ObjectIdPerEsborrarUsuari = docs[0]._id ;
							console.log( '>>> Esborrem el usuari de ID [' + ObjectIdPerEsborrarUsuari + '].' ) ;

							MyUsersCollection.remove ( {"_id": ObjectIdPerEsborrarUsuari }, { safe:true }, function ( err, result ) {

								if ( err ) {
									szResultat =  '--- Could not remove user from MongoDB. Error ('+err.errno+') is ('+err.message+').' ;
									console.log( szResultat ) ;
									res.status( 500 ).send( { 'error': szResultat } ) ; // internal error
								} else {
									szResultat = "+++ esborrar usuari OK. User("+ Baixa_UserName +")." ;
									console.log( szResultat ) ;
									res.status( 200 ).send( szResultat ) ; // else, indicate OK.
								} ; // if Error

							} ) ; // remove

						} else { // user does not exist 
							szResultat = '--- Error esborrant usuari - ('+ i +') slot not found. Nom ('+ Baixa_UserName +').' ;
							console.log( szResultat ) ;
							res.status( 200 ).send( szResultat ) ; // else, indicate no OK - OK as HTTP rc, but
						} ; // if user does not exist

					} else {
						szResultat = '--- Error baixa usuari - no DOCS returned.' ;
						console.log( szResultat ) ;
						res.status( 404 ).send( szResultat ) ; 
					} ; // if Docs
				} ; // if error in find()
			} ) ; // find()
		
		} else {

			szResultat = "--- Usuari {" + req.session.wcdt_nomsoci + "} no es administrador. No pots esborrar usuaris." ;
			console.log( szResultat ) ;
			res.status( 200 ).send( szResultat ) ; // OK
		
		} ; // user is not an administrator
		
	} else { // no hauria de passar mai ...
		szResultat = "--- CANT delete User - soci ["+ req.session.wcdt_nomsoci +"] not logged in." ;
		console.log( szResultat ) ;
		res.status( 200 ).send( szResultat ) ; 
	} ; // not logged in - cant delete old reserva

} ) ; // get /fer_baixa_usuari


// (16) GET /get_usr_and_host - called from Logon() click
app.get( '/get_usr_and_host', function ( req, res ) {

	var cli_IP = req.header('x-forwarded-for') || req.connection.remoteAddress ;
	var szUserAndHost = req.session.wcdt_nomsoci +'@'+ cli_IP ; // req.ip ; // connection.remoteAddress ; // server host is req.headers.host ;
	console.log( ">>> GET USRiHN[%s].", szUserAndHost ) ;
	res.status( 200 ).send( szUserAndHost ) ; 
	
} ) ; // get /get_usr_and_host


// *** finally, create our http(s) server and launch it

// http.createServer( app ).listen( app.get( 'port' ), function () {
//     console.log( 'Express server '+ myVersioLong +' listening on port ' + app.get( 'port' ) ) ;
// } ) ; // create server

//	var httpsServer = https.createServer( credentials, app ) ;
//	httpsServer.listen( app.get( 'my_port' ) ) ;
//	console.log( 'Express server ' + myVersioLong + ' listening on port [' + app.get( 'my_port' ) + '].' ) ;

// lets go (bmx-4)

	if ( process.env.VCAP_SERVICES ) {	// som a Bluemix

		http.createServer ( app ).listen( port, host );	
		console.log ( 'bluemix - our HTTP server ('+ myVersioLong +') is running at host ('+ host +'), port ('+ port +'). URL = http://'+host+':'+port+'/ ' ) ;

	} else { // local
		
//		http.createServer ( app ).listen( port, host );	
		app.listen( port, host, function() {
			console.log ( 'local - our HTTP server ('+ myVersioLong +') is running at host ('+ host +'), port ('+ port +'). URL = http://'+host+':'+ port +'/ ' ) ;
		} ).on( 'error', function( err ) {
			if ( err.errno === 'EADDRINUSE' ) { // catch port in use error
				console.log( '--- listen() error : port busy' ); 
			} else { 
				console.log( '--- listen() error : ', err ) ; 
			} ;
		} ) ; // try to catch EA
		

		https.createServer ( credentials, app ).listen ( portS , host ) ;
		console.log ( 'local - our HTTPS server ('+ myVersioLong +') is running at host ('+ host +'), port ('+ portS +'). URL = https://'+host+':'+ portS +'/ ' ) ;

	} ; // start 2 servers in local, one in bluemix