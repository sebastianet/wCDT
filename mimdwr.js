

exports.handlePing = hPing;


// (1) if customers asks for a "ping", we send actual date and the version of the code
function hPing(app) {

	app.get( '/ping', function ( req, res ) {

		var currentdate = new Date();
		var datetime = "Last Sync: " + currentdate.getDate() + "/"
					+ (currentdate.getMonth()+1)  + "/"
					+ currentdate.getFullYear() + " @ "
					+ currentdate.getHours() + ":"
					+ currentdate.getMinutes() + ":"
					+ currentdate.getSeconds() ;

		var texte = "Hello from Koltrane, " + myVersioLong ;
		texte += "<p>(" + datetime + ")<p><hr>" ;

		res.writeHead( 200, { 'Content-Type': 'text/html' } ) ; // write HTTP headers 
		res.write( texte ) ;
		res.end( ) ;

	} ) ; // get '/ping'
} ; // hPing()
