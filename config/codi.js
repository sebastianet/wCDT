
	var configapp = require( './config/app' ) ;
	console.log( "APP maxReservas (%s).", configapp.maxReservas ) ;
	console.log( "APP name (%s).", configapp.name ) ;

	var configdb = require( './config/db' ) ;
	console.log( "DB url (%s).", configdb.url ) ;

	var configup = require( './config/usrpw' ) ;
	console.log( "UP url (%s).", configup.user ) ;
	console.log( "UP pw (%s).", configup.pw ) ;