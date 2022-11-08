const Booking = require( '../models/booking.model' );

const express = require( 'express' );
const router = express.Router();

const formData = require( 'express-form-data' );
router.use( formData.parse() );


// ----- HENT/GET - ADMIN ----------------------------------------------------------
// ---------------------------------------------------------------------------------
router.get( '/admin/', async ( req, res ) => {

    console.log( "GET/hent - booking" )

    try {

        let bookings = await Booking.find();

        return res.status( 200 ).json( bookings );

    } catch ( error ) {

        console.log( error.message );
        return res.status( 400 ).json( { message: "Der er sket en fejl: " + error.message } );

    }

} );


// ----- HENT/GET UDVALGT - ADMIN -------------------------------------------------- 
// ---------------------------------------------------------------------------------

router.get( '/admin/:id', async ( req, res ) => {

    console.log( "GET/HENT - booking" );

    try {

        let booking = await Booking.findById( req.params.id );

        if ( booking == null ) {
            return res.status( 404 ).json( { message: 'Booking kunne ikke findes' } );
        }

        return res.status( 200 ).json( booking );

    } catch ( error ) {

        console.log( error.message );
        return res.status( 400 ).json( { message: "Der er sket en fejl: " + error.message } );

    }

} );

// ----- SØG/GET UDVALGT - ADMIN -------------------------------------------------- 
// ---------------------------------------------------------------------------------

router.get( '/admin/:key', async ( req, res ) => {

    console.log( "GET/SØG - booking" );

    try {

        let bookings = await Booking.find( {
            $or: [
                // søg i title og content -  små bogstaver/i
                { "phone": { "$regex": req.params.key, "$options": "i" } },
                { "email": { "$regex": req.params.key, "$options": "i" } },
                { "name": { "$regex": req.params.key, "$options": "i" } },
            ]
        } );

        if ( booking == null ) {
            return res.status( 404 ).json( { message: 'Booking kunne ikke findes - ingen match på søgning i name, phone, email' } );
        }

        return res.status( 200 ).json( booking );

    } catch ( error ) {

        console.log( error.message );
        return res.status( 400 ).json( { message: "Der er sket en fejl: " + error.message } );

    }

} );

// ----- OPRET/POST - IKKE ADMIN! --------------------------------------------------
// ---------------------------------------------------------------------------------

router.post( '/', async ( req, res ) => {

    console.log( "POST - booking", req.body )

    try {
        let booking = new Booking( req.body );
        await booking.save();
        return res.status( 200 ).json( { message: "Ny er oprettet", oprettet: booking } );

    } catch ( error ) {
        return res.status( 400 ).json( { message: "Der er sket en fejl: " + error.message } );
    }

} );


// ----- RET/PUT - ADMIN! ----------------------------------------------------------
// ---------------------------------------------------------------------------------

router.put( '/admin/:id', async ( req, res ) => {

    console.log( "PUT - booking", req.body )

    try {

        let booking = await Booking.findByIdAndUpdate( { _id: req.params.id }, req.body, { new: true } )

        if ( booking == null ) {
            return res.status( 404 ).json( { message: 'Data kunne ikke findes og rettes' } );
        }

        return res.status( 201 ).json( { message: "Booking er rettet", rettet: booking } )

    } catch ( error ) {
        return res.status( 400 ).json( { message: "Der er sket en fejl: " + error.message } );
    }

} );


// ----- SLET/DELETE - ADMIN ------------------------------------------------------- 
// ---------------------------------------------------------------------------------

router.delete( '/admin/:id', async ( req, res ) => {

    console.log( "DELETE - booking" )

    try {

        let booking = await Booking.findByIdAndDelete( req.params.id );

        if ( booking == null ) {
            return res.status( 404 ).json( { message: 'Data kunne ikke findes og slettes' } );
        }
        return res.status( 200 ).json( { message: "Booking er slettet" } );

    } catch ( error ) {
        return res.status( 400 ).json( { message: "Der er sket en fejl: " + error.message } );
    }

} );


// ----- RET/PATCH note (admin-note til booking) - ADMIN ---------------------------
// ---------------------------------------------------------------------------------
router.patch( '/note/admin/:id', async ( req, res ) => {

    console.log( "PATCH - booking/note" )

    try {

        let booking = await Booking.findById( req.params.id );
        booking.note = req.body.note; // true el. false 
        await booking.save();

        res.status( 200 ).json( { message: 'Booking note er rettet', rettet: booking } );

    } catch ( error ) {
        return res.status( 400 ).json( { message: "Der er sket en fejl: " + error.message } );
    }

} );


// ----- RET/PATCH accept-status (om besked er accepted = true/false) - ADMIN ------
// ---------------------------------------------------------------------------------
router.patch( '/accept/admin/:id', async ( req, res ) => {

    console.log( "PATCH - booking/accept", req.body.accept )

    try {

        let booking = await Booking.findById( req.params.id );
        booking.accept = req.body.accept; // true el. false 
        await booking.save();

        res.status( 200 ).json( { message: 'Booking accept-status er rettet', rettet: booking } );

    } catch ( error ) {
        return res.status( 400 ).json( { message: "Der er sket en fejl: " + error.message } );
    }

} );


module.exports = router;