
// source : http://webapplog.com/intro-to-express-js-simple-rest-api-app-with-monk-and-mongodb/

// definim una BBDD de Mongo :
//   BBDD = cdt ;
//   COLE = reserves_pistes ;
// contingut :
//   { "_id" : { "$oid" : "548352518af34124cb83ab7c" }, "rdata" : "2014/12/21", "rhora" : "12", "pista" : 3, "rnom" : "sebas"  }
//   { "_id" : { "$oid" : "548352518af34124cb83ab7d" }, "rdata" : "2014/12/20", "rhora" : "10", "pista" : 4, "rnom" : "pere"   }
//   { "_id" : { "$oid" : "548352518af34124cb83ab7e" }, "rdata" : "2014/12/21", "rhora" : "10", "pista" : 4, "rnom" : "enric"  }

// start MONGOD and then open ...
//    http://localhost:80                              => mostra les BBDD                      curl -i -X GET http://localhost:80/
//    http://localhost:80/collections                  => mostra les coleccions                curl -i -X GET http://localhost:80/collections
//    http://localhost:80/collections/reserves_pistes  => mostra els elements de la coleccio   curl -i -X GET http://localhost:80/collections/reserves_pistes

// 20141205 - v 1.1 - inici
//              1.2 - si fem servir el port 3000 tenim un problema
//              1.3 - rebem l'objecte i n'ensenyem els noms : .\public\cli.htm
//              1.4 - boto "submit" per enviar nom+cognom (logon/register) or TodaysDate (VeureOcupacio)
//              1.5 - link to "qui_te_reserves"
//              1.6 - filtrem per una data (format propi)

var mongo   = require( 'mongodb' ) ;
var express = require( 'express' ) ;
var monk    = require( 'monk' ) ;
var morgan  = require( 'morgan' ) ;            // log requests to the console (express4)

var db      = monk( 'localhost:27017/cdt' ) ;  // BBDD := "cdt" ;
var app     = new express() ;

app.use( express.static( __dirname + '/public') ) ;          // serve pages from "public" directory
app.use( morgan('dev') ) ;                                   // log every request to the console


app.get( '/', function( req, res ){
  console.log( ">>> GET the name of the DataBases." ) ;
  db.driver.admin.listDatabases( function( e, dbs ){ // http://mongodb.github.io/node-mongodb-native/api-generated/admin.html#listdatabases
      var  i = dbs.length;
	  console.error( "+++ we have (%s) databases.", i );
      res.json( dbs ) ; // send JSON object
  });
});


app.get( '/collections', function( req, res ){
  console.log( ">>> GET the names of the collections." ) ;
  db.driver.collectionNames( function( e, names ){
    res.json( names ) ; // send JSON object
  })
}) ; // get '/collections'


app.get( '/qui_te_reserves', function( req, res ){
  var CollectionName = "reserves_pistes" ; // collection fixed value
// CollectionName = req.params.name ; // used when '/qui_te_reserves/:name'
  console.log( ">>> GET 20 elements of collection (%s)", CollectionName ) ;
  var MyCollection = db.get( CollectionName ); // get the collection
  MyCollection.find( {}, {limit:20}, function( err, docs ){ // http://docs.mongodb.org/manual/reference/method/db.collection.find/
    if ( err ) {
	  console.error( "--- Failed to get from collection", err );
    } else {	
	  var  i = docs.length;
      console.error( "+++ the collection has (%s) elements.", i );
//    res.writeHead( 200, { 'Content-Type': 'application/json' } );
      res.json( docs ) ; // send JSON object
	} ;
  }) ; // find()
}); // get '/qui_te_reserves'


app.get( '/qui_te_reserves/data_Reserva=:dia_consultat', function( req, res ){
    var DiaConsultat = req.params.dia_consultat ; // if BLANK then 404 ;
	console.log( ">>> GET dia : veure 20 reserves del dia (%s) ", DiaConsultat ) ;
//	res.send( 'No ho se.' ) ;

    var CollectionName = "reserves_pistes" ; // collection fixed value
    var MyCollection = db.get( CollectionName ); // get the collection
	MyCollection.find( { rdata: DiaConsultat }, { limit: 20 }, function( err, docs ){ 
        var  i = docs.length;
        console.error( "+++ the collection for that date has (%s) elements.", i );
        res.json( docs ) ; // send JSON object
	}) ; // find()

}); // get '/qui_te_reserves/data_Reserva=:dia_consultat'


var myServer = app.listen( 80, function () {
    var vPort = myServer.address().port ;
    console.log( "App listening on port {%s}.", vPort ) ;
} ) ; // app.listen
