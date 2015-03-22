//
// create a DDBB of users of wCDT application
//   1) start Mongo
//   2) run "node wCDT_create_users_ddbb.js"
//

	var monk       = require( 'monk' ) ;                   // access to mongo
	var db         = monk( 'localhost:27017/cdt' ) ;       // BBDD := "cdt" ;
	
	var express    = require( 'express' ) ;                // http://expressjs.com/api.html
	var app        = express() ;                           // instantiate Express and assign our app variable to it
	
	app.set( 'cname', "wCDT_users" ) ;                     // collection name :=
 
	var CollectionName = app.get( 'cname' ) ;     // get collection name
    var MyCollection = db.get( CollectionName ) ; // get the collection
	console.log( ">>> POPULATE ddbb (" + MyCollection.name + ")." ) ;

	var My_User_To_Add_sebas = 
		{ 	
			uAlias        : "sebas", 
			uPwd          : "sebastia2015", 
			uRole         : "Administrator",
			uNom          : "Sebastia Altemir",
			uEmail        : "sebastiasebas@gmail.com",
			uLastLogin    : "2015/01/01",
			uMisc         : "-" 
		} ;

	var My_User_To_Add_pere = 
		{ 	
			uAlias        : "pere", 
			uPwd          : "pere2015", 
			uRole         : "Administrator",
			uNom          : "Pere Albert Labal",
			uEmail        : "palbcn@yahoo.com",
			uLastLogin    : "2015/01/01",
			uMisc         : "-" 
		} ;

	var My_User_To_Add_guest = 
		{ 				
			uAlias        : "guest", 
			uPwd          : "guest2015", 
			uRole         : "Guest",
			uNom          : "Usuari General",
			uEmail        : "nope@yahoo.com",
			uLastLogin    : "2015/01/01",
			uMisc         : "-" 
		} ;
		
	var My_User_To_Add = My_User_To_Add_pere ;
	
// +++ mode code comes here

	MyCollection.find( { uAlias: My_User_To_Add.uAlias }, { limit: 20 }, function( err, docs ){ 
		if ( err ) { 
			console.log( "--- Create user. Error accessing DDBB (%s). Error is (%s).", CollectionName, err.message ) ;
		} else {
			var  i = docs.length ;
			console.log( "+++ Before insert, the collection (%s) for Alias (%s) has (%s) elements.", CollectionName, My_User_To_Add.uAlias, i ) ;
			if ( i < 1 ) {
				MyCollection.insert( My_User_To_Add, { safe:true }, function( err, result ) {
					if ( err ) { 
						console.log( "--- populate ddbb (" + MyCollection.name + ") error. Error is (%s).", err.message ) ;
					} else { 
						console.log( "+++ populate ddbb (" + MyCollection.name + ") OK, user (%s).", My_User_To_Add.uAlias ) ;
					} ; // else
					db.close(); // allow the program to exit
				} ) ; // insert

			} else {
				console.log( "--- Create user - user (%s) already exists.", My_User_To_Add.uAlias ) ;
				db.close(); // allow the program to exit
			} ;
		} ;
	} ) ; // find()
