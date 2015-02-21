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

// nova funció yyyyymmdd de Date()
Date.prototype.yyyymmdd = function() {                            
        var yyyy = this.getFullYear().toString();                                    
        var mm   = (this.getMonth()+1).toString(); // getMonth() is zero-based         
        var dd   = this.getDate().toString();
        return yyyy + '/' + (mm[1]?mm:"0"+mm[0]) + '/' + (dd[1]?dd:"0"+dd[0]);
}; // yyyymmdd()

// do NOT drop, so we just ADD a new user

//    MyCollection.drop( function(e) {              // drop old database and wait completion

		var My_User_To_Add = 
			{ 	
				uAlias        : "sebas", 
				uPwd          : "sebastia2015", 
				uNom          : "Sebastia Altemir",
				uEmail        : "sebastiasebas@gmail.com",
				uLastLogin    : "2015/01/01",
				uNumReserves  : "3",
				uReserves     : 
					[ 
						{ uReservaPista : "5", uReservaDia : "2015/02/21", uReservaHora  : "09" } ,
						{ uReservaPista : "3", uReservaDia : "2015/02/23", uReservaHora  : "10" } ,
						{ uReservaPista : "4", uReservaDia : "2015/02/25", uReservaHora  : "12" } 
					],
				uMisc         : "-" 
			} ;
	 
		var Avui = (new Date).yyyymmdd() ;
		My_User_To_Add.uLastLogin = Avui ;
		
		My_User_To_Add.uReserves[0].uReservaDia = Avui ;
		My_User_To_Add.uReserves[1].uReservaDia = Avui ;
		My_User_To_Add.uReserves[2].uReservaDia = Avui ;
		
		MyCollection.insert( My_User_To_Add, { safe:true }, function( err, result ) {
	        if ( err ) { 
                console.log( "--- populate ddbb (" + MyCollection.name + ") ERROR." ) ;
	        } else { 
                console.log( "+++ populate ddbb (" + MyCollection.name + ") OK." ) ;
	        } ; // else
			db.close(); // allow the program to exit
		} ) ; // insert

//	} ) ; // drop
