const mongoose = require( 'mongoose' );

const teamSchema = new mongoose.Schema( {

    title: {
        type: String,
        required: [ true, 'Team: Title/titel er påkrævet!' ]
    },
    name: {
        type: String,
        required: [ true, 'Team: Navn/name er påkrævet!' ]
    },
    image: {
        type: String,
        required: [ true, 'Team: Image/profilfoto er påkrævet!' ]
    }
} )


module.exports = mongoose.model( 'Team', teamSchema, 'team' )