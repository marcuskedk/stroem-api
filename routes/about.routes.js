const About = require( '../models/about.model' );

const express = require( 'express' );
const router = express.Router();

// ----- Multer til upload af images -----------------------------------------------
// ---------------------------------------------------------------------------------

const multer = require( 'multer' );
const upload = multer( {

    storage: multer.diskStorage( {
        destination: function ( req, file, cb ) {
            cb( null, 'public/images/about' );
        },
        filename: function ( req, file, cb ) {
            //cb(null, Date.now() + '-' + file.originalname)
            cb( null, file.originalname )
        }
    } )
} );


// ----- HENT/GET  -----------------------------------------------------------------
// ---------------------------------------------------------------------------------

router.get( '/', async ( req, res ) => {

    console.log( "GET/hent - about" )

    try {

        let about = await About.findOne();

        if ( about == null ) {
            return res.status( 404 ).json( { message: 'Data/About kunne ikke findes' } );
        }

        return res.status( 200 ).json( about );

    } catch ( error ) {

        console.log( "FEJL: ", error );
        return res.status( 400 ).json( { message: "Der er sket en fejl: " + error.message } );
    }

} );


// ----- RET/PUT - ADMIN -----------------------------------------------------------
// ---------------------------------------------------------------------------------

router.put( '/admin/', upload.single("image"), async ( req, res ) => {

    console.log( "PUT - about" )

    try {

        // Hvis der er file/image med
        if ( req.file ) {
            req.body.image = req.file.filename;
        }

        let about = await About.findOneAndUpdate( {}, req.body, { new: true } );
        return res.status( 200 ).json( { message: 'About er rettet', rettet: about } );

    } catch ( error ) {
        console.log( "FEJL: ", error );
        return res.status( 400 ).json( { message: "Der er sket en fejl: " + error.message } );
    }

} );


module.exports = router;