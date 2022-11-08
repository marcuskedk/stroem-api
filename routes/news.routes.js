const News = require( '../models/news.model' );

const express = require( 'express' );
const router = express.Router();

const formData = require( 'express-form-data' );
//router.use( formData.parse() );
const parse = formData.parse();

// ----- Multer til upload af images -----------------------------------------------
// ---------------------------------------------------------------------------------

const multer = require( 'multer' );
const upload = multer( {

    storage: multer.diskStorage( {
        destination: function ( req, file, cb ) {
            cb( null, 'public/images/news' );
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

    console.log( "HENT ALLE - news" );

    try {
        const news = await News.find().sort( [ [ 'received', 1 ] ] );
        return res.status( 200 ).json( news );

    } catch ( error ) {
        return res.status( 400 ).json( { message: "Der er sket en fejl: " + error.message } );
    }

} );


// ----- HENT/GET UDVALGT  --------------------------------------------------------- 
// ---------------------------------------------------------------------------------

router.get( '/:id', async ( req, res ) => {

    console.log( "GET/HENT - news" );

    try {

        let news = await News.findById( req.params.id );

        if ( news == null ) {
            return res.status( 404 ).json( { message: 'Data kunne ikke findes' } );
        }

        return res.status( 200 ).json( news );

    } catch ( error ) {

        return res.status( 400 ).json( { message: "Der er sket en fejl: " + error.message } );

    }

} );


// ----- OPRET/POST NY - ADMIN -----------------------------------------------------
// ---------------------------------------------------------------------------------

router.post( '/admin', upload.single( "image" ), async ( req, res ) => {

    console.log( "POST - news" )

    try {

        let news = new News( req.body );
        news.image = req.file.filename;
        await news.save();

        return res.status( 201 ).json( { message: "Ny er oprettet", oprettet: news } );

    } catch ( error ) {
        return res.status( 400 ).json( { message: "Der er sket en fejl: " + error.message } );
    }

} );


// ----- SLET/DELETE - ADMIN ------------------------------------------------------- 
// ---------------------------------------------------------------------------------

router.delete( '/admin/:id', async ( req, res ) => {

    console.log( "DELETE - news" )

    try {

        let news = await News.findByIdAndDelete( req.params.id );

        if ( news == null ) {
            return res.status( 404 ).json( { message: 'Data kunne ikke findes og slettes' } );
        }
        return res.status( 200 ).json( { message: "News er slettet" } );

    } catch ( error ) {
        return res.status( 400 ).json( { message: "Der er sket en fejl: " + error.message } );
    }

} );


// ----- RET/PUT - ADMIN ----------------------------------------------------------- 
// ---------------------------------------------------------------------------------

router.put( '/admin/:id', upload.single( "image" ), async ( req, res ) => {

    console.log( "PUT - news" )

    try {

        if ( req.file ) {
            req.body.image = req.file.filename;
        } else {
            let s = await News.findById( req.params.id )
            req.body.image = s.image; // bevar nuværende
        }

        let news = await News.findByIdAndUpdate( { _id: req.params.id }, req.body, { new: true } )

        if ( news == null ) {
            return res.status( 404 ).json( { message: 'Data kunne ikke findes og rettes' } );
        }

        return res.status( 201 ).json( { message: "News er rettet", rettet: news } )

    } catch ( error ) {

        return res.status( 400 ).json( { message: "Der er sket en fejl: " + error.message } );
    }

} );



// ---------------------------------------------------------------------------------
// ---- COMMENTS (brugerkommentarer) -----------------------------------------------
// ---- OBS! router2 ---------------------------------------------------------------
// ---------------------------------------------------------------------------------


// ----- OPRET/POST comment (USER) -------------------------------------------------
// ---------------------------------------------------------------------------------
router.post( '/comment/:id', parse, async ( req, res ) => {

    console.log( "POST - news comment" )

    try {

        let news = await News.findOneAndUpdate(
            { _id: req.params.id },
            { $push: { "comments": req.body } },
            { new: true } );


        return res.status( 200 ).json( { message: "Ny comment er oprettet", comment: news.comments[ news.comments.length - 1 ] } ); // TODO: Snup comments _id i stedet

    } catch ( error ) {

        return res.status( 400 ).json( { message: "Der er sket en fejl: " + error.message } );

    }

} );


// ----- RET/PATCH publish/unpublish single comment - ADMIN ----------------------------------
// ---------------------------------------------------------------------------------
router.patch( '/comment/admin/:id/:commentId', parse, async ( req, res ) => {

    // Admin kan ændre comments publish-status - true eller false
    console.log( "PATCH - news comment publish-single" )
    try {

        let news = await News.findOneAndUpdate(
            { _id: req.params.id, "comments._id": req.params.commentId },
            { $set: { "comments.$.publish": req.body.publish } },
            { new: true } );

        return res.status( 200 ).json( { message: "Comments publish status er ændret", news: news } );

    } catch ( error ) {
        return res.status( 400 ).json( { message: "Der er sket en fejl: " + error.message } );
    }

} );


// ----- SLET/DELETE comment - ADMIN -----------------------------------------------
// ---------------------------------------------------------------------------------
router.delete( '/comment/admin/:id/:commentId', async ( req, res ) => {

    console.log( "DELETE - news comment", req.params.id, req.params.commentId )

    try {

        let news = await News.findOneAndUpdate(
            { _id: req.params.id },
            { $pull: { "comments": { _id: req.params.commentId } } },
            { new: true } );

        return res.status( 200 ).json( { message: "Comment er slettet", news: news } );

    } catch ( error ) {

        return res.status( 400 ).json( { message: "Der er sket en fejl: " + error.message } );

    }
} );


module.exports = router;