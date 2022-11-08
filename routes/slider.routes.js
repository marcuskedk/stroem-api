const Slider = require( '../models/slider.model' );

const express = require( 'express' );
const router = express.Router();

// ----- Multer til upload af images -----------------------------------------------
// ---------------------------------------------------------------------------------
const multer = require( 'multer' );
const upload = multer( {

    storage: multer.diskStorage( {
        destination: function ( req, file, cb ) {
            cb( null, 'public/images/slider' );
        },
        filename: function ( req, file, cb ) {
            //cb(null, Date.now() + '-' + file.originalname)
            cb( null, file.originalname )
        }
    } )
} );



// ----- HENT/GET (mulighed for limit) ---------------------------------------------
// ---------------------------------------------------------------------------------

router.get( '/', async ( req, res ) => {

    console.log( "GET/HENT - slider" );

    try {

        let limit;
        if ( req.query.limit ) {
            if ( !isNaN( parseInt( req.query.limit ) ) ) limit = parseInt( req.query.limit );
        }

        const slider = await Slider.find().limit( limit ); //.sort([['alttext', 1]]);
        return res.status( 200 ).json( slider );

    } catch ( error ) {
        return res.status( 400 ).json( { message: "Der er sket en fejl: " + error.message } );
    }

} );



// ----- HENT/GET UDVALGT ---------------------------------------------------------- 
// ---------------------------------------------------------------------------------

router.get( '/:id', async ( req, res ) => { //

    console.log( "GET/HENT - slider" );

    try {

        let slider = await Slider.findById( req.params.id );

        if ( slider == null ) {
            return res.status( 404 ).json( { message: 'Data kunne ikke findes' } );
        }

        return res.status( 200 ).json( slider );

    } catch ( error ) {

        console.log( error.message );
        return res.status( 400 ).json( { message: "Der er sket en fejl: " + error.message } );

    }

} );



// ----- OPRET/POST - ADMIN --------------------------------------------------------
// ---------------------------------------------------------------------------------

router.post( '/admin', upload.single( 'image' ), async ( req, res ) => {

    console.log( "POST - slider" )

    try {

        let slider = new Slider( req.body )
        slider.image = req.file.filename;

        await slider.save();
        return res.status( 201 ).json( { message: "Ny er oprettet", oprettet: slider } );

    } catch ( error ) {
        res.status( 400 ).json( { message: "Der er sket en fejl", error: error.message } );
    }

} );



// ----- SLET/DELETE - ADMIN -------------------------------------------------------
// ---------------------------------------------------------------------------------

router.delete( '/admin/:id', async ( req, res ) => {

    console.log( "DELETE - slider" )

    try {

        let slider = await Slider.findByIdAndDelete( req.params.id );
        if ( slider == null ) {
            return res.status( 404 ).json( { message: 'Data kunne ikke findes og slettes' } );
        }
        return res.status( 200 ).json( { message: "Slider er slettet" } );

    } catch ( error ) {
        return res.status( 400 ).json( { message: "Der er sket en fejl: " + error.message } );
    }

} );



// ----- RET/PUT - ADMIN -----------------------------------------------------------
// ---------------------------------------------------------------------------------

router.put( '/admin/:id', upload.single( 'image' ), async ( req, res ) => {

    console.log( "PUT - slider" )

    try {

        let slider;
        if ( req.file ) {
            req.body.image = req.file.filename
            slider = await Slider.findByIdAndUpdate( { _id: req.params.id }, req.body, { new: true } );
        } else {
            slider = await Slider.findByIdAndUpdate( { _id: req.params.id }, { caption: req.body.caption }, { new: true } );
        }

        if ( slider == null ) {
            return res.status( 404 ).json( { message: 'Data kunne ikke findes og rettes' } );
        }

        return res.status( 201 ).json( { message: "Slider er rettet", rettet: slider } );

    } catch ( error ) {
        res.status( 400 ).json( { message: "Der er sket en fejl", error: error.message } );
    }



} );




module.exports = router;