const mongoose = require( 'mongoose' );

const serviceSchema = new mongoose.Schema( {

    title: {
        type: String,
        required: [ true, 'Service: Title/titel er påkrævet!' ]
    },
    teaser: {
        type: String,
        required: [ true, 'Service: Teaser/kort beskrivelse er påkrævet!' ]
    },
    content: {
        type: String,
        required: [ true, 'Service: Content/indhold er påkrævet!' ]
    },
    image: {
        type: String,
        required: [ true, 'Service: Image/servicefoto er påkrævet!' ]
    },
    icon: {
        type: String,
        required: [ true, 'Service: Icon/ikon er påkrævet!' ]
    }
} )


module.exports = mongoose.model( 'Service', serviceSchema, 'service' )