
	var express    = require( 'express' ) ;                // http://expressjs.com/api.html
	var app        = express() ;                           // instantiate Express and assign our app variable to it
	
	var monk       = require( 'monk' ) ;                   // access to mongo
	var db         = monk( 'localhost:27017/cdt' ) ;       // BBDD := "cdt" ;
   
	app.set( 'rcolname', "reserves_pistes" ) ;    // reservation data := "reserves_pistes" ;
	app.set( 'userscolname', "wCDT_users" ) ;     // collection name := "wCDT_users" ;

	console.log( ">>> GET ALL reserves : veure fins a 20 reserves de tots els dies." ) ;
	var CollectionName = app.get( 'userscolname' ) ;     // get collection name
    var MyCollection = db.get( CollectionName ) ;    // get the collection

	MyCollection.find( {  }, { limit: 20 }, function( err, docs ){ // empty filter
	    if ( err ) { 
            console.log( "--- Dump all reservas. Error accessing DDBB (%s). Error is (%s).", CollectionName, err.message ) ;
        } else {
            var  lng = docs.length ;
			console.log( "+++ the collection (%s) for all dates has (%s) elements.", CollectionName, lng ) ;
			
			if ( lng > 0 ) {
				console.log( "Hi ha (" + lng + ") usuaris." ) ;
				var i = 0 ;
				var texte = "" ;
				while ( i < lng ) {
					texte = "("+ i +") " ;
					texte += "user (" + docs[i].uAlias + ") " ;
					texte += "pwd ("  + docs[i].uPwd + ") " ;
					texte += "role (" + docs[i].uRole + ") " ;
					texte += "ID ["   + docs[i]._id + "] " ;
					console.log ( texte ) ;
					i++ ;
				} // while
			} else { 
				console.log( "No users defined yet." ) ;
			} ; // lng = 0
			
		} ;
		db.close(); // allow the program to exit
	}) ; // find()
