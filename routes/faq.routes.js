const FAQ = require( '../models/faq.model' );

const express = require( 'express' );
const router = express.Router();

const formData = require( 'express-form-data' );
router.use( formData.parse() );

// ----- HENT/GET ------------------------------------------------------------------
// ---------------------------------------------------------------------------------

router.get( '/', async ( req, res ) => {

    console.log( "GET/HENT - faq" );

    try {

        const faq = await FAQ.find();
        return res.status( 200 ).json( faq );

    } catch ( error ) {
        return res.status( 400 ).json( { message: "Der er sket en fejl: " + error.message } );
    }

} );



// ----- HENT/GET UDVALGT ---------------------------------------------------------- 
// ---------------------------------------------------------------------------------

router.get( '/:id', async ( req, res ) => { //

    console.log( "GET/HENT - faq" );

    try {

        let faq = await FAQ.findById( req.params.id );

        if ( faq == null ) {
            return res.status( 404 ).json( { message: 'Data kunne ikke findes' } );
        }

        return res.status( 200 ).json( faq );

    } catch ( error ) {

        return res.status( 400 ).json( { message: "Der er sket en fejl: " + error.message } );

    }

} );



// ----- OPRET/POST - ADMIN --------------------------------------------------------
// ---------------------------------------------------------------------------------

router.post( '/admin', async ( req, res ) => {

    console.log( "POST - faq" )

    try {

        let faq = new FAQ( req.body )

        await faq.save();
        return res.status( 201 ).json( { message: "Ny er oprettet", oprettet: faq } );

    } catch ( error ) {
        res.status( 400 ).json( { message: "Der er sket en fejl", error: error.message } );
    }

} );



// ----- SLET/DELETE - ADMIN -------------------------------------------------------
// ---------------------------------------------------------------------------------

router.delete( '/admin/:id', async ( req, res ) => {

    console.log( "DELETE - faq" )

    try {

        let faq = await FAQ.findByIdAndDelete( req.params.id );

        if ( faq == null ) {
            return res.status( 404 ).json( { message: 'Data kunne ikke findes og slettes' } );
        }

        return res.status( 200 ).json( { message: "FAQ er slettet" } );

    } catch ( error ) {
        return res.status( 400 ).json( { message: "Der er sket en fejl: " + error.message } );
    }

} );



// ----- RET/PUT - ADMIN -----------------------------------------------------------
// ---------------------------------------------------------------------------------

router.put( '/admin/:id', async ( req, res ) => {

    console.log( "PUT - faq" )

    try {

        let faq = await FAQ.findByIdAndUpdate( { _id: req.params.id }, req.body, { new: true } );

        if ( faq == null ) {
            return res.status( 404 ).json( { message: 'Data kunne ikke findes og rettes' } );
        }

        return res.status( 201 ).json( { message: "FAQ er rettet", rettet: faq } );

    } catch ( error ) {
        res.status( 400 ).json( { message: "Der er sket en fejl", error: error.message } );
    }
} );

module.exports = router;