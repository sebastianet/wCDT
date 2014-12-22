exports.addWine = function(req, res) {
app.post( '/fer_una_reserva/Nom_Soci=:res_nom_soci&Pista_Reserva=:res_pista&Dia_Reserva=:res_dia&Hora_Reserva=:res_hora', function( req, res ){
    var Reserva_NomSoci = req.params.res_nom_soci ;
	var Reserva_Pista   = req.params.res_pista ;
	var Reserva_Dia     = req.params.res_dia ;
	var Reserva_Hora    = req.params.res_hora ;
	console.log( ">>> GET fer una nova reserva. Nom (%s), pista (%s), dia (%s), hora (%s).", Reserva_NomSoci, Reserva_Pista, Reserva_Dia, Reserva_Hora ) ;
	
	var CollectionName = app.get( 'cname' ) ;     // get collection name
   	var MyCollection = db.get( CollectionName ) ; // get the collection
	
}); // get '/fer_una_eserva/<parametres>'
