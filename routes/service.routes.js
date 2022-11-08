const Service = require( '../models/service.model' );

const express = require( 'express' );
const router = express.Router();


// ----- Multer til upload af images -----------------------------------------------
// ---------------------------------------------------------------------------------

const multer = require( 'multer' );
const upload = multer( {

    storage: multer.diskStorage( {
        destination: function ( req, file, cb ) {
            cb( null, 'public/images/service' );
        },
        filename: function ( req, file, cb ) {
            //cb(null, Date.now() + '-' + file.originalname)
            cb( null, file.originalname )
        }
    } )
} );


// ----- HENT/GET ALLE -------------------------------------------------------------
// ---------------------------------------------------------------------------------

router.get( '/', async ( req, res ) => {

    console.log( "HENT ALLE - services" );

    try {
        const services = await Service.find().sort( [ [ 'title', 1 ] ] );
        return res.status( 200 ).json( services );

    } catch ( error ) {
        return res.status( 400 ).json( { message: "Der er sket en fejl: " + error.message } );
    }

} );


// ----- HENT/GET UDVALGT  --------------------------------------------------------- 
// ---------------------------------------------------------------------------------

router.get( '/:id', async ( req, res ) => {

    console.log( "GET/HENT - service" );

    try {

        let service = await Service.findById( req.params.id );

        if ( service == null ) {
            return res.status( 404 ).json( { message: 'Data kunne ikke findes' } );
        }

        return res.status( 200 ).json( service );

    } catch ( error ) {

        return res.status( 400 ).json( { message: "Der er sket en fejl: " + error.message } );

    }

} );


// ----- OPRET/POST NY - ADMIN -----------------------------------------------------
// ---------------------------------------------------------------------------------

router.post( '/admin', upload.single( "image" ), async ( req, res ) => {

    console.log( "POST - service" )

    try {

        let service = new Service( req.body );
        service.image = req.file.filename;
        await service.save();

        return res.status( 201 ).json( { message: "Ny er oprettet", oprettet: service } );

    } catch ( error ) {
        return res.status( 400 ).json( { message: "Der er sket en fejl: " + error.message } );
    }

} );


// ----- SLET/DELETE - ADMIN ------------------------------------------------------- 
// ---------------------------------------------------------------------------------

router.delete( '/admin/:id', async ( req, res ) => {

    console.log( "DELETE - service" )

    try {

        let service = await Service.findByIdAndDelete( req.params.id );

        if ( service == null ) {
            return res.status( 404 ).json( { message: 'Data kunne ikke findes og slettes' } );
        }
        return res.status( 200 ).json( { message: "Service er slettet" } );

    } catch ( error ) {
        return res.status( 400 ).json( { message: "Der er sket en fejl: " + error.message } );
    }

} );


// ----- RET/PUT - ADMIN ----------------------------------------------------------- 
// ---------------------------------------------------------------------------------

router.put( '/admin/:id', upload.single( "image" ), async ( req, res ) => {

    console.log( "PUT - service" )

    try {
        
        if ( req.file ) {
            req.body.image = req.file.filename;
        } else {
            let s = await Service.findById(req.params.id)
            req.body.image = s.image; // bevar nuværende
        }

        let service = await Service.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true })

        if ( service == null ) {
            return res.status( 404 ).json( { message: 'Data kunne ikke findes og rettes' } );
        }

        return res.status( 201 ).json( { message: "Service er rettet", rettet: service } )

    } catch ( error ) {

        return res.status( 400 ).json( { message: "Der er sket en fejl: " + error.message } );
    }

} );

module.exports = router;