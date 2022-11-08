const mongoose = require( 'mongoose' );


const commentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [ true, 'News comment: Navn/name er påkrævet' ]
        },
        comment: {
            type: String,
            required: [ true, 'News comment: Kommentar/comment er påkrævet' ]
        },
        received: {
            type: Date,
            default: Date.now
        },
        publish: {
            type: Boolean,
            default: false
        }
    }
);


const newsSchema = new mongoose.Schema( {

    title: {
        type: String,
        required: [ true, 'Service: Title/titel er påkrævet!' ]
    },
    content: {
        type: String,
        required: [ true, 'Service: Content/indhold er påkrævet!' ]
    },
    image: {
        type: String,
        required: [ true, 'Service: Image/servicefoto er påkrævet!' ]
    },
    received: {
        type: Date,
        default: Date.now
    },
    comments: [ commentSchema ]
} )


module.exports = mongoose.model( 'News', newsSchema, 'news' )