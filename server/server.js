/**
 * A quick and dirty express server to server planetary data 
 */
var express = require( 'express' ),
    server = module.exports.server = exports.server = express(),
    router = express.Router(),
    PLANETS = require( './planets.json' );

router.get( '/planets/random', function( req, res ) {
    var planet = [ PLANETS[ Math.floor( Math.random() * PLANETS.length ) ] ];

    res.json( { data: planet } );
} );

router.get( '/planets', function( req, res ) {
    res.json( { data: PLANETS } );
} );

server.use( require( 'connect-livereload' )() );

server.use( '/api', router );
server.use( express.static( './dist/dev/' ) );


server.listen( 3000, function () {
  console.log( 'Listening on port 3000! ');
} );
