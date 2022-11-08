const News = require( '../models/news.model' );
const Service = require( '../models/service.model' );

const express = require( 'express' );
const router = express.Router();

// ----- HENT/GET - SØGNING I NEWS + SERVICES --------------------------------------
// ---------------------------------------------------------------------------------

router.get( '/:q', async ( req, res ) => {

    console.log( "GET/hent - search - news and services" )

    try {

        const services = await Service.find( {
            $or: [
                // søg i title og content -  små bogstaver/i
                { "title": { "$regex": req.params.q, "$options": "i" } },
                { "content": { "$regex": req.params.q, "$options": "i" } },
                { "teaser": { "$regex": req.params.q, "$options": "i" } },
            ]
        } );

        const news = await News.find( {
            $or: [
                // søg i title og content -  små bogstaver/i
                { "title": { "$regex": req.params.q, "$options": "i" } },
                { "content": { "$regex": req.params.q, "$options": "i" } },
            ]
        } );

        return res.status( 200 ).json( { searchresult: { news: news, services: services } } );

    } catch ( error ) {

        console.log( error );
        return res.status( 400 ).json( { message: "Der er sket en fejl: " + error.message } );
    }

} );



module.exports = router;